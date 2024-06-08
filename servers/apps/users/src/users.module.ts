import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolver';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { PrismaService } from '../../../prisma/Prisma.Service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    UserResolver,
    EmailService,
  ],
})
export class UsersModule {}
