import { PrismaService } from '@/infra/db/prisma.service';
import { Either, left, right } from '@/shared/either';
import { PaginatedOrdersDto } from '@/utils/dto/paginated-orders.dto';
import { Paginated } from '@/utils/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EntityNotExistsError } from './errors/entity-not-exists-error';
import { OrderAlreadyExistsOnDatabase } from './errors/order-already-exists-on-database-error';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: PaginatedOrdersDto): Promise<
    Either<
      null,
      {
        orders: Order[];
      }
    >
  > {
    const paginated = new Paginated<PaginatedOrdersDto>(dto);

    const orders = await this.prisma.order.findMany({
      where: {
        ...(paginated.pickedUpAt && {
          pickedUpAt: {
            not: null,
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: paginated.take,
      skip: paginated.skip,
    });

    return right({
      orders,
    });
  }

  async find(id: string): Promise<
    Either<
      OrderAlreadyExistsOnDatabase,
      {
        order: Order;
      }
    >
  > {
    const order = await this.orderOnDatabase(id);

    if (!order) {
      return left(new OrderAlreadyExistsOnDatabase());
    }

    return right({
      order,
    });
  }

  async createOrder({
    recipientId,
    deliverymanId,
    details,
  }: CreateOrderDto): Promise<
    Either<
      EntityNotExistsError,
      {
        order: Order;
      }
    >
  > {
    const recipient = await this.recipientOnDatabase(recipientId);

    if (!recipient) {
      return left(new EntityNotExistsError('recipient'));
    }

    if (deliverymanId) {
      const deliveryman = this.deliverymanOnDatabase(deliverymanId);

      if (!deliveryman) {
        return left(new EntityNotExistsError('deliveryman'));
      }
    }

    const order = await this.prisma.order.create({
      data: {
        details,
        recipientId,
        ...(deliverymanId && { deliverymanId }),
      },
    });

    return right({
      order,
    });
  }

  async updateOrder(
    { attachmentsIds, details, deliverymanId }: UpdateOrderDto,
    orderId: string
  ): Promise<Either<OrderAlreadyExistsOnDatabase, {}>> {
    const order = await this.orderOnDatabase(orderId);

    if (!order) {
      return left(new OrderAlreadyExistsOnDatabase());
    }

    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        ...(details && { details }),
        ...(deliverymanId && { deliverymanId }),
      },
    });

    if (attachmentsIds) {
      const deleteAttachmentsIds = order.attachments
        .filter(attachment => !attachmentsIds.includes(attachment.id))
        .map(item => item.id);

      await this.deleteAttachmentsRelations(deleteAttachmentsIds);

      await this.updateAttachmentsRelations(attachmentsIds, orderId);
    }

    return right({});
  }

  async deleteOrder(id: string): Promise<Either<Error, {}>> {
    const order = await this.orderOnDatabase(id);

    if (!order) {
      return left(new Error('Order does not exist'));
    }

    await this.prisma.order.delete({
      where: {
        id: order.id,
      },
    });

    return right({});
  }

  private async orderOnDatabase(id: string) {
    return await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        attachments: true,
      },
    });
  }

  private async recipientOnDatabase(id: string) {
    return await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });
  }

  private async deliverymanOnDatabase(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
        role: 'DELIVERYMAN',
      },
    });
  }

  private async updateAttachmentsRelations(
    attachmentsIds: string[] | undefined,
    orderId: string
  ) {
    if (!attachmentsIds) {
      return null;
    }

    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        orderId,
      },
    });
  }

  private async deleteAttachmentsRelations(attachmentsIds: string[]) {
    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }
}
