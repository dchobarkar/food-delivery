import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { EmailService } from './email/email.service';
import { PrismaService } from '../../../prisma/Prisma.Service';
import { TokenSender } from './utils/sendToken';

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
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // Register User
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, phone_number, password } = registerDto;

    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist)
      throw new BadRequestException('User already exists with this email');

    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (isPhoneNumberExist)
      throw new BadRequestException(
        'User already exists with this phone number',
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  // Create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      { user, activationCode },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );

    return { token, activationCode };
  }

  // Activation User
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode)
      throw new BadRequestException('Invalid activation code');

    const { name, email, password, phone_number } = newUser.user;
    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser)
      throw new BadRequestException('User already exists with this email');

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  // Login Service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
  }

  // Compare with hashed password
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      { user },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );

    return forgotPasswordToken;
  }

  // Forgot Password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new BadRequestException('User not found with this email!');

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your password',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: 'Your forgot password request successful' };
  }

  // Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);
    if (!decoded || decoded?.exp * 1000 < Date.now())
      throw new BadRequestException('Invalid Token');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.prisma.user.update({
      where: { id: decoded.user.id },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  // Get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;

    return { user, accessToken, refreshToken };
  }

  // Log out user
  async logout(req: any) {
    req.user = null;
    req.accessToken = null;
    req.refreshToken = null;

    return { message: 'Logged out successfully' };
  }

  // Get all users service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
