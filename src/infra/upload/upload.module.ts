import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { R2Uploader } from './r2-uploader.service';
import { Uploader } from './uploader';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Uploader,
    },
  ],
  exports: [Uploader],
})
export class UploadModule {}
