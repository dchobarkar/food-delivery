import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { RegisterResponse } from './types/user.types';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password)
      throw new BadRequestException('Please fill all the fields');

    const user = await this.usersService.register(registerDto, context.res);

    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.usersService.getUsers();
  }
}
