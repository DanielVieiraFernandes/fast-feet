import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PaginatedOrdersDto } from '../dto/paginated-orders.dto';

export const PaginationOrder = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginatedOrdersDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const dto = plainToInstance(PaginatedOrdersDto, query, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error('Validation failed for pagination query parameters.');
    }

    return dto;
  }
);
