import { Response, Request } from "express";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";

import {
  ActivationResponse,
  LoginResponse,
  LogoutResposne,
  RegisterResponse,
} from "./types/restaurant.type";
import { ActivationDto, RegisterDto } from "./dto/restaurant.dto";
import { AuthGuard } from "./guards/auth.guard";
import { RestaurantService } from "./restaurant.service";

@Resolver("Restaurant")
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Send activation code to create new restaurant
  @Mutation(() => RegisterResponse)
  async registerRestaurant(
    @Args("registerDto") registerDto: RegisterDto,
    @Context() context: { res: Response }
  ): Promise<RegisterResponse> {
    return await this.restaurantService.registerRestaurant(
      registerDto,
      context.res
    );
  }

  // Activate the new restaurant account
  @Mutation(() => ActivationResponse)
  async activateRestaurant(
    @Args("activationDto") activationDto: ActivationDto,
    @Context() context: { res: Response }
  ): Promise<ActivationResponse> {
    return await this.restaurantService.activateRestaurant(
      activationDto,
      context.res
    );
  }

  // Login restaurant
  @Mutation(() => LoginResponse)
  async LoginRestaurant(
    @Args("email") email: string,
    @Args("password") password: string
  ): Promise<LoginResponse> {
    return await this.restaurantService.LoginRestuarant({ email, password });
  }

  // Get logged in restaurant
  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInRestaurant(
    @Context() context: { req: Request }
  ): Promise<LoginResponse> {
    return await this.restaurantService.getLoggedInRestaurant(context.req);
  }

  // Log out restaurant
  @Query(() => LogoutResposne)
  @UseGuards(AuthGuard)
  async logOutRestaurant(@Context() context: { req: Request }) {
    return await this.restaurantService.Logout(context.req);
  }
}
