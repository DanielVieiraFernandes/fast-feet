import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';
import { Either, left, right } from 'src/shared/either';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error';

@Injectable()
export class RecipientService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecipient(
    createRecipient: CreateRecipientDto
  ): Promise<Either<RecipientAlreadyExistsError, {}>> {
    const recipient = await this.recipientOnDatabase(createRecipient.email);

    if (recipient) {
      return left(new RecipientAlreadyExistsError());
    }

    await this.prisma.recipient.create({
      data: createRecipient,
    });

    return right({});
  }

  private async recipientOnDatabase(email: string) {
    return await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    });
  }
}
