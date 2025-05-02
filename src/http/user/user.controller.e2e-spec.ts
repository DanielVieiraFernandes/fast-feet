import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/infra/db/prisma.service';
import request from 'supertest';

describe('Create user', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, JwtService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  test('[POST] /api/users', async () => {
    const user = await prisma.user.create({
      data: {
        cpf: '888.888.888-88',
        password: '123456',
        role: 'ADMIN',
      },
    });

    const accessToken = jwt.sign({
      sub: user.id,
      role: user.role,
    });

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '888.888.888-89',
        password: '123456',
        role: 'DELIVERYMAN',
      });

    console.log(response.error);

    expect(response.statusCode).toEqual(201);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '888.888.888-88',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
