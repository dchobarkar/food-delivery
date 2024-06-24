import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFoodDto {
  @Field()
  @IsNotEmpty({ message: "Food name is required." })
  @IsString({ message: "Food name must be a string." })
  name: string;

  @Field()
  @IsNotEmpty({ message: "Food description is required." })
  @IsString({ message: "Food description must be string." })
  description: string;

  @Field()
  @IsNotEmpty({ message: "Food price is required." })
  price: number;

  @Field()
  @IsNotEmpty({ message: "Food estimated price is required." })
  estimated_price: number;

  @Field()
  @IsNotEmpty({ message: "Food category is required." })
  @IsString({ message: "Food category must be a string." })
  category: string;

  @Field(() => [String])
  @IsArray({ message: "Food images must be an array." })
  @ArrayNotEmpty({ message: "Food images array must not be empty." })
  images: string[];
}

@InputType()
export class DeleteFoodDto {
  @Field()
  @IsNotEmpty({ message: "Food id is required." })
  @IsString({ message: "Food id must be a string." })
  id: string;
}
