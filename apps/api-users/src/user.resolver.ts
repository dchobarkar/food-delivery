import { Response } from "express";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";

import { User } from "./entities/user.entities";
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResposne,
  RegisterResponse,
  ResetPasswordResponse,
} from "./types/user.types";
import {
  ActivationDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
} from "./dto/user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { UsersService } from "./user.service";

@Resolver("User")
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  // Create new user
  @Mutation(() => RegisterResponse)
  async register(
    @Args("registerDto") registerDto: RegisterDto,
    @Context() context: { res: Response }
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password)
      throw new BadRequestException("Please fill all the fields");

    return await this.userService.register(registerDto, context.res);
  }

  // Activate current user
  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args("activationDto") activationDto: ActivationDto,
    @Context() context: { res: Response }
  ): Promise<ActivationResponse> {
    return await this.userService.activateUser(activationDto, context.res);
  }

  // Login user
  @Mutation(() => LoginResponse)
  async Login(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }

  // Get logged in user
  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.userService.getLoggedInUser(context.req);
  }

  // Forgot password
  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args("forgotPasswordDto") forgotPasswordDto: ForgotPasswordDto
  ): Promise<ForgotPasswordResponse> {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  // Reset password
  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args("resetPasswordDto") resetPasswordDto: ResetPasswordDto
  ): Promise<ResetPasswordResponse> {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  // Log out user
  @Query(() => LogoutResposne)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.userService.Logout(context.req);
  }

  // Get all users
  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
