import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: "Restaurant name is required." })
  @IsString({ message: "Restaurant name must be a string." })
  name: string;

  @Field()
  @IsNotEmpty({ message: "Restaurant country is required." })
  @IsString({ message: "Restaurant country must be a string." })
  country: string;

  @Field()
  @IsNotEmpty({ message: "Restaurant city is required." })
  @IsString({ message: "Restaurant city must be a string." })
  city: string;

  @Field()
  @IsNotEmpty({ message: "Restaurant address is required." })
  @IsString({ message: "Restaurant address must be a string." })
  address: string;

  @Field()
  @IsNotEmpty({ message: "Restaurant email is required." })
  @IsEmail({}, { message: "Email is invalid." })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Restaurant phone number is required." })
  phone_number: number;

  @Field()
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(8, {
    message: "Password must be at least 8 characters long.",
  })
  password: string;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: "Activation token is required." })
  activation_token: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Invalid email." })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password is required." })
  password: string;
}
