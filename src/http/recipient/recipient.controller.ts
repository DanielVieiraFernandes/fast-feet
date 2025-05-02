import { Roles } from '@/infra/auth/roles';
import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { RecipientService } from './recipient.service';

@Controller('recipients')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post()
  @Roles(['ADMIN'])
  async createRecipient(@Body() createRecipientDto: CreateRecipientDto) {
    const result =
      await this.recipientService.createRecipient(createRecipientDto);

    if (result.isLeft()) {
      throw new ConflictException(result.value.message);
    }
  }
}
