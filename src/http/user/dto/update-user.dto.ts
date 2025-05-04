import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'cpf must be in the format XXX.XXX.XXX-XX',
  })
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsOptional()
  cpf?: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, {
    message: 'Password must be exactly 6 characters long',
  })
  @Transform(({ value }) => (value === null ? undefined : value))

  @IsOptional()
  password?: string;

  @ValidateIf(o => !o.details && !o.recipientId)
  validateAtLeastOneField(value: unknown, args: ValidationArguments) {
    if (!value) {
      throw new Error('At least one field must be provided');
    }
    return true;
  }
}
