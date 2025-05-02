import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

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
}
