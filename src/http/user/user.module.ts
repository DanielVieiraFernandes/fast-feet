import { Module } from '@nestjs/common';
import { CryptoModule } from '@/infra/crypto/crypto.module';
import { DBModule } from '@/infra/db/db.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DBModule, CryptoModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
