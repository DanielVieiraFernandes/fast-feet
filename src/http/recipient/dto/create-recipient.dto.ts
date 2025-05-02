import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateRecipientDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter ao menos três caracteres' })
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

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
}
