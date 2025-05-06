import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

export class UpdateOrderDto {
  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  deliverymanId?: string;

  @IsString()
  @MaxLength(255, {
    message: 'Detalhes devem ter no máximo 255 caracteres',
  })
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsOptional()
  details?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'attachmentsIds não pode ser vazio' })
  @ArrayMaxSize(1, {
    message: 'deve ser anexada apenas uma foto ao entregar a a encomenda',
  })
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsOptional()
  attachmentsIds?: string[];

  @ValidateIf(o => !o.details && !o.recipientId)
  validateAtLeastOneField(value: unknown, args: ValidationArguments) {
    if (!value) {
      throw new Error('At least one field must be provided');
    }
    return true;
  }
}
