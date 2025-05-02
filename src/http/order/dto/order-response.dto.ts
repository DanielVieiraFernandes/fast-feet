import { ApiProperty } from '@nestjs/swagger';

class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  details: string;

  @ApiProperty()
  recipientId: string;

  @ApiProperty()
  deliverymanId: string | null;

  @ApiProperty({ type: Date, nullable: true })
  pickedUpAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  deliveredAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  returnedAt: Date | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class OrderResponseDto {
  @ApiProperty()
  order: OrderDto;
}
