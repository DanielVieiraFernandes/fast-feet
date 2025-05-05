export interface UploadAttachment {
  body: Buffer;
  fileName: string;
  fileType: string;
}

export abstract class Uploader {
  abstract upload(params: UploadAttachment): Promise<{ url: string }>;
}
