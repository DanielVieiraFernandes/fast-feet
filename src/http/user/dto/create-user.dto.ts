import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsNumber, IsString, Length, Matches, MinLength } from 'class-validator';

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
  // @MinLength(3, { message: 'o estado deve ter no mínimo três caracteres' })
  state: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, { message: 'O CEP deve ter o formato XXXXX-XXX' })
  zipcode: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
