import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { appSetup, swaggerSetup } from './app/app.setup';
import { EnvService } from './infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  appSetup(app);

  swaggerSetup(app, configService);

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
