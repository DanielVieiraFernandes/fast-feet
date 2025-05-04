import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/infra/db/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create recipient', () => {
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

  test('[POST] /api/orders', async () => {
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

    const recipient = await prisma.recipient.create({
      data: {
        name: 'Recipient',
        address: '',
        city: '',
        email: '',
        state: '',
        zipcode: '',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id,
        details: 'New Details',
      });

    // console.log(response.error);

    expect(response.statusCode).toEqual(201);

    const ordersOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id,
        details: 'New Details',
      },
    });

    expect(ordersOnDatabase).toBeTruthy();
  });
});
