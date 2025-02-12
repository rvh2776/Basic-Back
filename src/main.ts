import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.use(cors(corsOptions));

  //* Configuracion de Auth0
  app.use(auth(auth0Config));

  //* Validador global de Pipes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores en la petición',
          errors: cleanErrors,
        });
      },
    }),
  );
  app.use(loggerGlobal);

  //* Integrar Swagger, para documentar la API.
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`API: Basic-Back`)
    .setContact(
      'Rafael Velazquez',
      'https://www.linkedin.com/in/rafael-velazquez-25a928165/',
      'rafael.vh@gmail.com',
    )
    .setDescription(
      `<hr <font color=#2E86C1>
      <h4><font color=#2E86C1>Documentación oficial de la <b>API: <a target='blank' href="https://github.com/rvh2776/basic-back">Basic-BackEnd</a></b>.</h4>
      <p><font color=#2E86C1>Esta API está construida con <b>NestJS</b> y utiliza <b>Swagger</b> para fines de documentación.</p>
      <p><font color=#2E86C1>Módulo <b>Back-end</b> de la aplicacion <b>Basic-Back</b></p>
      <p><font color=#2E86C1>Aquí encontrará toda la información necesaria para interactuar con nuestros endpoints.</p>
      <hr <font color=#2E86C1>
      <p align="right"><font color=#2E86C1><i><b>Version 1.0.0</b></i></p>
      <p align="right"><font color=#2E86C1>Para cualquier consulta o soporte, por favor contacte a nuestro equipo de desarrollo.</p>
    `,
    )
    .setVersion('1.0.0')
    .addBearerAuth() // Este parametro nos permite pasar token de autorizacion a las pruebas de la API, se pueden agregar diferentes tipos de autorizacion.
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
