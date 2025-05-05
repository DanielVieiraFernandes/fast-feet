import { IsString, Matches } from 'class-validator';
import { IsBuffer } from '../validators/validate-buffer';

export class UploadAttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  @Matches('/^(image/(jpeg|png))$|^application/pdf$/.test(fileType)')
  fileType: string;

  @IsBuffer()
  body: Buffer;
}
