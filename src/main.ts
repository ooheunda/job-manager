import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { appOptions } from '@/app.option';
import { GlobalExceptionFilter } from '@/common/exceptions';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, appOptions);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Job Manager')
    .setDescription('작업 관리 시스템 API 문서')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/api`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api');

  await app.listen(port);
}
bootstrap();
