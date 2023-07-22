import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyparser from 'body-parser';
import { NODE_ENV, PORT } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyparser.json({ limit: '50mb' }));
  app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));

  // ENABLE CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  if (NODE_ENV === 'development') {
    // Swagger SETUP
    const config = new DocumentBuilder()
      .setTitle('Professional ecommerce ')
      .setDescription('The professional ecommerce API description')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(helmet());

  // AppDataSource.initialize()
  //   .then(() => {
  //     console.log('Data Source has been initialized!');
  //   })
  //   .catch((err) => {
  //     console.error('Error during Data Source initialization', err);
  //   });

  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    app.close();
    // close database connection
    const dataSource: DataSource = app.get(DataSource);
    dataSource.destroy();
    process.exit(0);
  });

  await app.listen(PORT ?? 3000);
}
bootstrap();
