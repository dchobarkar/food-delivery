import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  // Activate user
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.access_token as string;
    const refreshToken = req.headers.refresh_token as string;

    if (!accessToken || !refreshToken)
      throw new UnauthorizedException("Please login to access this resource!");

    if (accessToken) {
      const decoded = this.jwtService.decode(accessToken);
      if (decoded?.exp * 1000 < Date.now()) await this.updateAccessToken(req);
    }

    return true;
  }

  // Update given access token
  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refresh_token as string;
      const decoded = this.jwtService.decode(refreshTokenData);
      if (decoded.exp * 1000 < Date.now())
        throw new UnauthorizedException(
          "Please login to access this resource!"
        );

      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
          expiresIn: "5m",
        }
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
          expiresIn: "7d",
        }
      );

      req.access_token = accessToken;
      req.refresh_token = refreshToken;
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
