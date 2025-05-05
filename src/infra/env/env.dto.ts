import { IsNumberString, IsString } from 'class-validator';

export class EnvDto {
  @IsString()
  DATABASE_URL: string;

  @IsNumberString()
  PORT: number;

  @IsString()
  JWT_PRIVATE_KEY: string;

  @IsString()
  JWT_PUBLIC_KEY: string;

  @IsString()
  CLOUDFLARE_ACCOUNT_ID: string;

  @IsString()
  AWS_BUCKET_NAME: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;
}
