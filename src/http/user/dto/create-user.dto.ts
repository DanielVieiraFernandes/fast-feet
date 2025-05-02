import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length, Matches } from 'class-validator';

enum UserRole {
  DELIVERYMAN = 'DELIVERYMAN',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'cpf must be in the format XXX.XXX.XXX-XX',
  })
  cpf: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6, {
    message: 'Password must be exactly 6 characters long',
  })
  password: string;

  @ApiProperty()
  @IsEnum(UserRole, {
    message: 'incorrect',
  })
  role: UserRole;
}
