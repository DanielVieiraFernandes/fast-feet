import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginatedOrdersDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  page?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  size?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === null ? undefined : value))
  @ApiProperty()
  pickedUpAt?: boolean;
}
