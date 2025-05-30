import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/infra/db/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Create user', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let user: User;
  let userTest: User;

  let accessToken: string;

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
    user = await prisma.user.create({
      data: {
        cpf: '888.888.888-88',
        password: await hash('123456', 2),
        role: 'ADMIN',
        address: '',
        city: '',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
      },
    });

    userTest = await prisma.user.create({
      data: {
        cpf: '888.888.888-77',
        password: await hash('123456', 2),
        role: 'DELIVERYMAN',
        address: '',
        city: '',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
      },
    });

    accessToken = jwt.sign({
      sub: user.id,
      role: user.role,
    });

    await app.init();
  });

  test('[POST] /api/users', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '888.888.888-89',
        password: '123456',
        role: 'DELIVERYMAN',
        details: 'New Details',
        address: 'Rua Jerônimo da Silva',
        city: 'Hortolândia',
        state: 'SP',
        zipcode: '00000-000',
        latitude: 35.689487,
        longitude: 139.691711,
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

  test('[GET] /api/users', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users?page=1&size=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);

    console.log(response.body.content.users);
  });

  test('[GET] /api/users/:id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/users/${userTest.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    console.log(response.error);

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: userTest.id,
      }),
    });
  });

  test('[PUT] /api/users/:id', async () => {
    console.log('Antes de alterar: ', userTest);
    const response = await request(app.getHttpServer())
      .put(`/api/users/${userTest.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '777.888.888-77',
      });

    // console.log(response.error)
    expect(response.statusCode).toEqual(200);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '777.888.888-77',
      },
    });

    console.log('depois de alterar ', userOnDatabase);

    expect(userOnDatabase).toBeTruthy();
  });

  test('[DELETE] /api/users/:id', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/users/${userTest.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // console.log(response.error)
    expect(response.statusCode).toEqual(200);

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '777.888.888-77',
      },
    });

    expect(userOnDatabase).toBeNull();
  });
});
