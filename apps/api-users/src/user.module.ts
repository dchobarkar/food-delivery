import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { UsersResolver } from "./user.resolver";
import { UsersService } from "./user.service";
import { EmailModule } from "./email/email.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    EmailModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    JwtService,
    PrismaService,
    UsersResolver,
    UsersService,
  ],
})
export class UsersModule {}
