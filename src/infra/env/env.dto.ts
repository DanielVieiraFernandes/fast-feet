import { IsNumberString, IsString } from 'class-validator';

export class EnvDto {
  @IsString()
  DATABASE_URL: string;

  @IsNumberString()
  PORT: number;

  @IsString()
  JWT_PRIVATE_KEY: string

  @IsString()
  JWT_PUBLIC_KEY: string
}
