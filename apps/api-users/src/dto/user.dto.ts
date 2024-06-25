import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: "Name is required." })
  @IsString({ message: "Name must be a string." })
  name: string;

  @Field()
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password: string;

  @Field()
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Email is invalid." })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Phone number is required." })
  phone_number: number;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: "Activation token is required." })
  activation_token: string;

  @Field()
  @IsNotEmpty({ message: "Activation code is required." })
  activation_code: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Email must be valid." })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}

@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Email must be valid." })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password: string;

  @Field()
  @IsNotEmpty({ message: "Activation token is required." })
  activation_token: string;
}
