import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty()
  access_token: string;
}
