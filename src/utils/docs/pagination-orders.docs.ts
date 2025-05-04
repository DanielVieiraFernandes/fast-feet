import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiPaginatedOrders = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (starting at 1)',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: 'Number of items per page',
    }),
    ApiQuery({
        name: 'pickedUpAt',
        required: false,
        type: Boolean,
        description: 'search for orders already withdrawn',
      })
  );
};
