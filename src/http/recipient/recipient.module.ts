import { Module } from '@nestjs/common';
import { DBModule } from 'src/infra/db/db.module';
import { RecipientController } from './recipient.controller';
import { RecipientService } from './recipient.service';

@Module({
  imports: [DBModule],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
