import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginatedRequestDto {
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
}


