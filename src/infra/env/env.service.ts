import { ConfigService } from '@nestjs/config';
import { EnvDto } from './env.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvDto, true>) {}

  get<T extends keyof EnvDto>(key: T) {
    return this.configService.get<T>(key, { infer: true });
  }
}
