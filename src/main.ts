import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import * as compression from 'compression';

import * as compression from 'compression';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/exception-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);
  app.use(compression());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(new Reflector(), {}),
  );

  const config = new DocumentBuilder()
    .setTitle('Seeder Application APIs')
    .setDescription('APIs for managing seeker and lender operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
