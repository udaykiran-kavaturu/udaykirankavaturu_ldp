import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/exception-handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
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

  await app.listen(3000);
}
bootstrap();
