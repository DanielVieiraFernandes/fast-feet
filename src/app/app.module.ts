import { AttachmentModule } from '@/http/attachment/attachment.module';
import { OrderModule } from '@/http/order/order.module';
import { RecipientModule } from '@/http/recipient/recipient.module';
import { UserModule } from '@/http/user/user.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { PrismaService } from '@/infra/db/prisma.service';
import { EnvDto } from '@/infra/env/env.dto';
import { EnvService } from '@/infra/env/env.service';
import { EmailModule } from '@/infra/events/email.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: env => {
        const validateConfig = plainToClass(EnvDto, env);

        const errors = validateSync(validateConfig);

        if (errors.length > 0) {
          throw new Error(
            `Env validation failed: ${errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ')}`
          );
        }

        return validateConfig;
      },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    RecipientModule,
    OrderModule,
    AttachmentModule,
    EmailModule,
  ],
  providers: [EnvService, PrismaService],
})
export class AppModule {}
