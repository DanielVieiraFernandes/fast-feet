import { Roles } from '@/infra/auth/roles';
import { Pagination } from '@/utils/decorators/pagination.decorator';
import { ApiPaginated } from '@/utils/docs/pagination.docs';
import { PaginatedRequestDto } from '@/utils/dto/paginated-request.dto';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UserDoesNotExistError } from './errors/user-does-not-exist-error';
import { UserService } from './user.service';

@ApiExtraModels(UserDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(['ADMIN'])
  @ApiPaginated()
  @ApiResponse({
    status: 200,
    example: {
      content: {
        users: '[]',
      },
    },
  })
  async findAll(@Pagination() paginatedRequestDto: PaginatedRequestDto) {
    const result = await this.userService.findAll(paginatedRequestDto);

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { users } = result.value;

    return {
      content: {
        users,
      },
    };
  }

  @Post()
  @Roles(['ADMIN'])
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.createUser(createUserDto);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }

  @Put('/:id')
  @Roles(['ADMIN'])
  @ApiResponse({
    status: 201,
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string
  ) {
    const result = await this.userService.updateUser(id, updateUserDto);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserDoesNotExistError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;

    return {
      user,
    };
  }

  @Get('/:id')
  @Roles(['ADMIN'])
  @ApiOkResponse({
    schema: {
      properties: {
        user: { $ref: getSchemaPath(UserDto) },
      },
    },
  })
  
  async findById(@Param('id') id: string) {
    const result = await this.userService.findById(id);

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { user } = result.value;

    return {
      user,
    };
  }

  @Delete('/:id')
  @Roles(['ADMIN'])
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserDoesNotExistError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
