import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @ApiProperty()
  recipientId: string;

  @IsUUID()
  @Transform(({ value }) => (value === null ? undefined : value))
  @IsOptional()
  @ApiProperty()
  deliverymanId?: string;

  @IsString()
  @MaxLength(255, {
    message: 'Detalhes devem ter no máximo 255 caracteres',
  })
  @ApiProperty()
  details: string;

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: 'o endereço deve ter no mínimo 5 caracteres' })
  address: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'a cidade deve ter no mínimo três caracteres' })
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, { message: 'O CEP deve ter o formato XXXXX-XXX' })
  zipcode: string;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longitude: number;
}
