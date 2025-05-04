import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PaginatedRequestDto } from '../dto/paginated-request.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginatedRequestDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const dto = plainToInstance(PaginatedRequestDto, query, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error('Validation failed for pagination query parameters.');
    }

    return dto;
  }
);
