import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
