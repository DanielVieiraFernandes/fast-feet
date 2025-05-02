import { DBModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { RecipientController } from './recipient.controller';
import { RecipientService } from './recipient.service';

@Module({
  imports: [DBModule],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
