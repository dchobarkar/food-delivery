import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { UsersModule } from "./user.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "apps/api-users/email-templates"));
  app.setViewEngine("ejs");
  app.enableCors({
    origin: "*",
  });

  await app.listen(4001);
}
bootstrap();
