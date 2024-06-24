import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Restaurant } from "@prisma/client";

export class TokenSender {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  public sendToken(restaurant: Restaurant) {
    const accessToken = this.jwtService.sign(
      {
        id: restaurant.id,
      },
      {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "1m",
      }
    );
    const refreshToken = this.jwtService.sign(
      {
        id: restaurant.id,
      },
      {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "3d",
      }
    );

    return { restaurant, accessToken, refreshToken };
  }
}
