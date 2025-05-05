import { DBModule } from '@/infra/db/db.module';
import { UploadModule } from '@/infra/upload/upload.module';
import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [DBModule, UploadModule],
  providers: [AttachmentService],
  controllers: [AttachmentController],
  exports: [AttachmentService],
})
export class AttachmentModule {}
