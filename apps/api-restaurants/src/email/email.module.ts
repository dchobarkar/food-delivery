import { join } from "path";
import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

import { EmailService } from "./email.service";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("SMTP_HOST"),
          secure: true,
          auth: {
            user: config.get("SMTP_MAIL"),
            pass: config.get("SMTP_PASSWORD"),
          },
        },
        defaults: {
          from: "DarshanWebDev",
        },
        template: {
          dir: join(__dirname, "../../../apps/api-restaurants/email-templates"),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}