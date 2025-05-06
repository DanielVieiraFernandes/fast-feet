import { Roles } from '@/infra/auth/roles';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Roles(['ADMIN', 'DELIVERYMAN'])
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.attachmentService.createAttachment({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { attachmentId } = result.value;

    return {
      attachmentId,
    };
  }
}
