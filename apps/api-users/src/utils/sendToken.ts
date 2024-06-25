import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

export class TokenSender {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  // Send access token and refresh token
  public sendToken(user: User) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "1m",
      }
    );
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "3d",
      }
    );

    return { user, accessToken, refreshToken };
  }
}
