import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.Service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Register User
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist)
      throw new BadRequestException('User already exists with this email');

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return { user, response };
  }

  // Login Service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = {
      email,
      password,
    };

    return user;
  }

  // Get all users service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
