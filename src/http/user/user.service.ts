import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Hash } from '@/infra/crypto/hash';
import { PrismaService } from '@/infra/db/prisma.service';
import { Either, left, right } from '@/shared/either';
import { type CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: Hash,
    private jwt: JwtService
  ) {}

  async createUser({ cpf, role, password }: CreateUserDto): Promise<
    Either<
      UserAlreadyExistsError,
      {
        accessToken: string;
      }
    >
  > {
    const userOnDatabase = await this.userOnDatabase(cpf);

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

  private async userOnDatabase(cpf: string) {
    return await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });
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
