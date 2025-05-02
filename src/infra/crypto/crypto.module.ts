import { Module } from '@nestjs/common';
import { Hash } from './hash';
import { HashService } from './hash.service';

@Module({
  providers: [
    {
      provide: Hash,
      useClass: HashService,
    },
  ],
  exports: [Hash],
})
export class CryptoModule {}
