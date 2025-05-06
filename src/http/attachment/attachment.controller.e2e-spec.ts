import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/infra/db/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import request from 'supertest';

describe('Controller attachment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let user: User;
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
        password: '123456',
        role: 'ADMIN',
        city: '',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
      },
    });

    accessToken = jwt.sign({
      sub: user.id,
      role: user.role,
    });

    await app.init();
  });

  test.skip('[POST] /api/attachments', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/attachment')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    console.log(response.error);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });

    const attachmentId = response.body.attachmentId;

    const attachmentOnDatabase = await prisma.attachment.findFirst({
      where: {
        id: attachmentId,
      },
    });

    // console.log(attachmentOnDatabase)

    expect(attachmentOnDatabase).toBeTruthy();
  });
});
