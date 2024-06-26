import { Request, Response } from "express";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";

import {
  CreateFoodResponse,
  DeleteFoodResponse,
  LoggedInRestaurantFoodResponse,
} from "./types/foods.types";
import { CreateFoodDto, DeleteFoodDto } from "./dto/foods.dto";
import { AuthGuard } from "../guards/auth.guard";
import { FoodsService } from "./foods.service";

@Resolver("Foods")
export class FoodsResolver {
  constructor(private readonly foodsService: FoodsService) {}

  // Create new food
  @Mutation(() => CreateFoodResponse)
  @UseGuards(AuthGuard)
  async createFood(
    @Context() context: { req: Request; res: Response },
    @Args("createFoodDto") createFoodDto: CreateFoodDto
  ) {
    return await this.foodsService.createFood(
      createFoodDto,
      context.req,
      context.res
    );
  }

  // Get current restaurant all foods
  @Query(() => LoggedInRestaurantFoodResponse)
  @UseGuards(AuthGuard)
  async getLoggedInRestaurantFoods(
    @Context() context: { req: any; res: Response }
  ) {
    return await this.foodsService.getLoggedInRestuarantFood(
      context.req,
      context.res
    );
  }

  // Delete food of a restaurant
  @Mutation(() => DeleteFoodResponse)
  @UseGuards(AuthGuard)
  async deleteFood(
    @Context() context: { req: any },
    @Args("deleteFoodDto") deleteFoodDto: DeleteFoodDto
  ) {
    return this.foodsService.deleteFood(deleteFoodDto, context.req);
  }
}
