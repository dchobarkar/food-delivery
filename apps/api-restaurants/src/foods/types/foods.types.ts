import { Field, ObjectType } from "@nestjs/graphql";
import { Foods } from "prisma/prisma-client";

import { Food } from "../entities/foods.entities";
import { ErrorType } from "../../types/restaurant.type";

@ObjectType()
export class CreateFoodResponse {
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoggedInRestaurantFoodResponse {
  @Field(() => [Food], { nullable: true })
  foods: Foods;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class DeleteFoodResponse {
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
