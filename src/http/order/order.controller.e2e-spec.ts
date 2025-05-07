import { AppModule } from '@/app/app.module';
import { PrismaService } from '@/infra/db/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Recipient, User } from '@prisma/client';
import request from 'supertest';

describe('Create recipient', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let user: User;
  let deliveryMan: User;
  let recipient: Recipient;
  let accessToken: string;
  let accessTokenDelivery: string;

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

    deliveryMan = await prisma.user.create({
      data: {
        cpf: '888.818.888-52',
        password: '123456',
        role: 'DELIVERYMAN',
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

    accessTokenDelivery = jwt.sign({
      sub: deliveryMan.id,
      role: deliveryMan.role,
    });

    // criei o recipient com latitude e longitude de Tókio

    recipient = await prisma.recipient.create({
      data: {
        name: 'Recipient',
        address: '',
        city: '',
        email: 'recipient@gmail.com',
        state: '',
        zipcode: '',
        latitude: 35.689487,
        longitude: 139.691711,
      },
    });
    await app.init();
  });

  test('[POST] /api/orders', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id,
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

    const ordersOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id,
        details: 'New Details',
      },
    });

    console.log(ordersOnDatabase);

    expect(ordersOnDatabase).toBeTruthy();
  });

  test('[PUT] /api/orders/:id', async () => {
    const order = await prisma.order.create({
      data: {
        recipientId: recipient.id,
        details: 'new details',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
        city: '',
      },
    });

    const attachment = await prisma.attachment.create({
      data: {
        title: 'Attachment title',
        url: 'url.com',
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/api/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        details: 'big order',
        attachmentsIds: [attachment.id],
      });

    console.log(response.error);

    expect(response.statusCode).toEqual(200);

    const ordersOnDatabase = await prisma.order.findFirst({
      where: {
        details: 'big order',
      },
    });

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: {
        id: attachment.id,
      },
    });

    expect(ordersOnDatabase).toBeTruthy();
    expect(attachmentOnDatabase?.orderId).toEqual(ordersOnDatabase?.id);
  });

  test('[DELETE] /api/orders/:id', async () => {
    const order = await prisma.order.create({
      data: {
        recipientId: recipient.id,
        details: 'new details',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
        city: '',
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/api/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // console.log(response.error);

    expect(response.statusCode).toEqual(200);

    const ordersOnDatabase = await prisma.order.findFirst({
      where: {
        id: order.id,
      },
    });

    expect(ordersOnDatabase).toBeNull();
  });

  test('[GET] /api/orders/:id', async () => {
    const order = await prisma.order.create({
      data: {
        recipientId: recipient.id,
        details: 'new details',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
        city: '',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/api/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // console.log(response.error);

    expect(response.statusCode).toEqual(200);

    const ordersOnDatabase = await prisma.order.findFirst({
      where: {
        id: order.id,
      },
    });

    expect(ordersOnDatabase).toBeTruthy();
  });

  test('[GET] retornar nada /api/orders', async () => {
    await prisma.order.create({
      data: {
        recipientId: recipient.id,
        details: 'new details',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
        city: '',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/api/orders`)
      .set('Authorization', `Bearer ${accessToken}`);

    // console.log(response.error);

    expect(response.statusCode).toEqual(200);
  });

  test('[PATCH] retornar nada /api/orders', async () => {
    const order = await prisma.order.create({
      data: {
        recipientId: recipient.id,
        details: 'new details',
        latitude: -22.876945,
        longitude: -47.250198,
        state: '',
        zipcode: '',
        address: '',
        city: '',
      },
    });

    console.log('pickeupantes ', order);

    const response = await request(app.getHttpServer())
      .patch(`/api/orders/withdraw/${order.id}`)
      .set('Authorization', `Bearer ${accessTokenDelivery}`);

    // console.log(response.error);

    expect(response.statusCode).toEqual(204);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
    });

    // console.log("depoiiiiiiiiis", orderOnDatabase);

    expect(orderOnDatabase?.pickedUpAt).toEqual(expect.any(Date));
  });
});
