import { EnvService } from '@/infra/env/env.service';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Swagger');

export const appSetup = (app: INestApplication) => {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
};

export const swaggerSetup = (app: INestApplication, env: EnvService) => {
  const config = new DocumentBuilder()
    .setTitle('Fast Feet API')
    .setDescription('API de entrega de encomendas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = env.get('PORT');
  logger.log(`Swagger disponível em: http://localhost:${port}/api`);
};
