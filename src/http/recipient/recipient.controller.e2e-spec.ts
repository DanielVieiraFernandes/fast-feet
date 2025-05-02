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

  test('[POST] /api/recipients', async () => {
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
      .post('/api/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        address: 'Rua Jerônimo da Silva',
        city: 'Hortolândia',
        state: 'SP',
        zipcode: '00000-000',
      });

    // console.log(response.error);

    expect(response.statusCode).toEqual(201);

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        email: 'daniel@gmail.com',
      },
    });

    console.log(recipientOnDatabase);

    expect(recipientOnDatabase).toBeTruthy();
  });
});
