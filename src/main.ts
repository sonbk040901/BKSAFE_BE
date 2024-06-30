import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'fatal', 'verbose'],
  });
  const config = new DocumentBuilder()
    .setTitle('BKSAFE API')
    .setDescription('BKSAFE API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.use(cookieParser());
  app.use(morgan('dev'));
  await app.listen(3000);
}

bootstrap().then(() => console.log('BKSafe started!'));
