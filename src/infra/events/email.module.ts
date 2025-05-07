import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        return {
          transport: {
            host: 'live.smtp.mailtrap.io',
            port: 587,
            auth: {
              user: env.get('MAILTRAP_USER'),
              pass: env.get('MAILTRAP_PASS'),
            },
          },
          defaults: {
            from: 'FastFeet <hello@demomailtrap.co>',
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
