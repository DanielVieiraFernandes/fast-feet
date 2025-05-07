import { CurrentUser } from '@/infra/auth/current-user';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Roles } from '@/infra/auth/roles';
import { PaginationOrder } from '@/utils/decorators/pagination-orders.decorator';
import { ApiPaginatedOrders } from '@/utils/docs/pagination-orders.docs';
import { PaginatedOrdersDto } from '@/utils/dto/paginated-orders.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EntityNotExistsError } from './errors/entity-not-exists-error';
import { OrderAlreadyExistsOnDatabase } from './errors/order-already-exists-on-database-error';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: 200,
    type: OrderResponseDto,
  })
  @Get('/:id')
  @Roles(['ADMIN', 'DELIVERYMAN'])
  async find(@Param('id') id: string) {
    const result = await this.orderService.find(id);

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { order } = result.value;

    return {
      order,
    };
  }

  @ApiResponse({
    status: 200,
    example: {
      content: {
        orders: '[]',
      },
    },
  })
  @ApiPaginatedOrders()
  @Get()
  @Roles(['ADMIN', 'DELIVERYMAN'])
  async findAll(
    @PaginationOrder() paginatedOrdersDto: PaginatedOrdersDto,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.orderService.findAll(
      paginatedOrdersDto,
      user.sub
    );

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    console.log(result.value);

    const { orders } = result.value;

    return {
      content: {
        orders,
      },
    };
  }

  @ApiResponse({ status: 201, type: OrderResponseDto })
  @Post()
  @Roles(['ADMIN'])
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

  @ApiResponse({ status: 200 })
  @Put('/:id')
  @Roles(['ADMIN'])
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Param('id') id: string
  ) {
    const result = await this.orderService.updateOrder(updateOrderDto, id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case OrderAlreadyExistsOnDatabase:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  @ApiResponse({ status: 200 })
  @Delete('/:id')
  @Roles(['ADMIN'])
  async deleteOrder(@Param('id') id: string) {
    const result = await this.orderService.deleteOrder(id);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
