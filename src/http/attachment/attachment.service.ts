import { PrismaService } from '@/infra/db/prisma.service';
import { Uploader } from '@/infra/upload/uploader';
import { Either, left, right } from '@/shared/either';
import { Injectable } from '@nestjs/common';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private uploader: Uploader
  ) {}

  async createAttachment({
    body,
    fileName,
    fileType,
  }: UploadAttachmentDto): Promise<
    Either<
      InvalidAttachmentTypeError,
      {
        attachmentId: string;
      }
    >
  > {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError());
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    });

    const attachment = await this.prisma.attachment.create({
      data: {
        title: fileName,
        url,
      },
    });

    return right({
      attachmentId: attachment.id,
    });
  }
}
