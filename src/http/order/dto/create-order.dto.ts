import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  recipientId: string;

  @IsUUID()
  deliverymanId: string;

  @IsString()
  @MaxLength(255, {
    message: 'Detalhes devem ter no máximo 255 caracteres',
  })
  details: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'attachmentsIds não pode ser vazio' })
  @ArrayMaxSize(1, {
    message: 'deve ser anexada apenas uma foto ao entregar a a encomenda',
  })
  @IsUUID()
  attachmentsIds: string[];
}
