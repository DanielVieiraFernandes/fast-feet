import { Body, Controller, Post } from '@nestjs/common';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { RecipientService } from './recipient.service';
import { Roles } from 'src/infra/auth/roles';

@Controller('recipients')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post()
  @Roles(['ADMIN'])
  async createRecipient(@Body() createRecipientDto: CreateRecipientDto) {
    await this.recipientService.createRecipient(createRecipientDto);
  }
}
