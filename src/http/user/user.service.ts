import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Hash } from '@/infra/crypto/hash';
import { PrismaService } from '@/infra/db/prisma.service';
import { Either, left, right } from '@/shared/either';
import { PaginatedRequestDto } from '@/utils/dto/paginated-request.dto';
import { Paginated } from '@/utils/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { type CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UserDoesNotExistError } from './errors/user-does-not-exist-error';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: Hash,
    private jwt: JwtService
  ) {}

  async findAll(dto: PaginatedRequestDto): Promise<
    Either<
      null,
      {
        users: User[];
      }
    >
  > {
    const paginated = new Paginated(dto);

    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: paginated.skip,
      take: paginated.take,
    });

    return right({
      users,
    });
  }

  async findById(id: string): Promise<
    Either<
      UserDoesNotExistError,
      {
        user: User;
      }
    >
  > {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return left(new UserDoesNotExistError());
    }

    return right({
      user,
    });
  }

  async createUser({ cpf, role, password }: CreateUserDto): Promise<
    Either<
      UserAlreadyExistsError,
      {
        accessToken: string;
      }
    >
  > {
    const userOnDatabase = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (userOnDatabase) {
      return left(new UserAlreadyExistsError());
    }

    const user = await this.createUserInDatabase({ cpf, password, role });

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    return right({ accessToken });
  }

  async updateUser(
    id: string,
    { cpf, password }: UpdateUserDto
  ): Promise<
    Either<
      UserDoesNotExistError,
      {
        user: User;
      }
    >
  > {
    const userOnDatabase = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userOnDatabase) {
      return left(new UserDoesNotExistError());
    }

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(cpf && { cpf }),
        ...(password && { password }),
      },
    });

    return right({
      user,
    });
  }

  async deleteUser(id: string): Promise<Either<UserDoesNotExistError, {}>> {
    const userOnDatabase = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userOnDatabase) {
      return left(new UserDoesNotExistError());
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return right({});
  }

  private async createUserInDatabase(createUserDto: CreateUserDto) {
    const passwordHashed = await this.hashService.hash(createUserDto.password);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHashed,
      },
    });
  }

  private async generateAccessToken(user: UserPayload) {
    return this.jwt.sign({
      sub: user.sub,
      role: user.role,
    });
  }
}
