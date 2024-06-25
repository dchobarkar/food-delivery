import { Response } from "express";
import * as bcrypt from "bcrypt";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { User } from "@prisma/client";

import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "./email/email.service";
import { TokenSender } from "./utils/sendToken";

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  // Create new user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist)
      throw new BadRequestException("User already exists with this email!");

    const phoneNumbersToCheck = [phone_number];
    const usersWithPhoneNumber = await this.prismaService.user.findMany({
      where: {
        phone_number: {
          not: null,
          in: phoneNumbersToCheck,
        },
      },
    });
    if (usersWithPhoneNumber.length > 0)
      throw new BadRequestException(
        "User already exists with this phone number!"
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const token = await this.createActivationToken(user);
    const activationCode = token.activationCode;
    const activationToken = token.token;

    await this.emailService.sendMail({
      email,
      subject: "Activate your account!",
      template: "./activation-mail",
      name,
      activation_code: activationCode,
    });

    return { activation_token: activationToken, response };
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>("ACTIVATION_SECRET"),
        expiresIn: "5m",
      }
    );

    return { token, activationCode };
  }

  // Activate current user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activation_token, activation_code } = activationDto;
    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activation_token, {
        secret: this.configService.get<string>("ACTIVATION_SECRET"),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activation_code)
      throw new BadRequestException("Invalid activation code");

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser)
      throw new BadRequestException("User already exists with this email!");

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  // Login user
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        access_token: null,
        refresh_token: null,
        error: {
          message: "Invalid email or password",
        },
      };
    }
  }

  // Compare with hashed password
  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refresh_token;
    const accessToken = req.access_token;

    return { user, refreshToken, accessToken };
  }

  // Forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new BadRequestException("User not found with this email!");

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl =
      this.configService.get<string>("CLIENT_SIDE_URI") +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: "Reset your Password!",
      template: "./forgot-password",
      name: user.name,
      activation_code: resetPasswordUrl,
    });

    return { message: `Your forgot password request succesful!` };
  }

  // Generate forgot password link
  async generateForgotPasswordLink(user: User) {
    return this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>("FORGOT_PASSWORD_SECRET"),
        expiresIn: "5m",
      }
    );
  }

  // Reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activation_token } = resetPasswordDto;
    const decoded = await this.jwtService.decode(activation_token);

    if (!decoded || decoded?.exp * 1000 < Date.now())
      throw new BadRequestException("Invalid token!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  // Log out user
  async Logout(req: any) {
    req.user = null;
    req.refresh_token = null;
    req.access_token = null;

    return { message: "Logged out successfully!" };
  }

  // Get all users
  async getUsers() {
    return this.prismaService.user.findMany({});
  }
}
