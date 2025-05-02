import { DBModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [DBModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
