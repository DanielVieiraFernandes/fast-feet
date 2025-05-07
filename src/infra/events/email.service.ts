import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('order.withdraw')
  async sendEmailOrderWithdraw(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Encomenda a caminho!',
      text: `Sua encomenda foi retirada pelo entregador e está a caminho!`,
    });
  }

  @OnEvent('order.delivered')
  async sendEmailOrderDelivered(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Encomenda entregue!',
      text: `Sua encomenda foi entregue, avalie nossos serviços!`,
    });
  }

  @OnEvent('order.returned')
  async sendEmailOrderReturned(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Retorno de encomenda!',
      text: `Recebemos novamente sua encomenda!`,
    });
  }
}
