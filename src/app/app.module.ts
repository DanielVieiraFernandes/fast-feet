import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { RecipientModule } from 'src/http/recipient/recipient.module';
import { UserModule } from 'src/http/user/user.module';
import { AuthModule } from 'src/infra/auth/auth.module';
import { PrismaService } from 'src/infra/db/prisma.service';
import { EnvDto } from 'src/infra/env/env.dto';
import { EnvService } from 'src/infra/env/env.service';
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
    AuthModule,
    UserModule,
    RecipientModule,
  ],
  providers: [EnvService, PrismaService],
})
export class AppModule {}
