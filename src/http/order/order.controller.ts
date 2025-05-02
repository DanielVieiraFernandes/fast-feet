import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { EntityNotExistsError } from './errors/entity-not-exists-error';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const result = await this.orderService.createOrder(createOrderDto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EntityNotExistsError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { order } = result.value;

    return {
      order,
    };
  }
}
