import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'test@test.com', password: 'Testing1#' });

    jwtToken = response.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('Get /products/ retorna un array de productos y status code ok', async () => {
    const req = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(req.status).toBe(200);
    expect(req.body.data).toBeInstanceOf(Array);
  });

  it('Get /products/:id retorna un producto por id y status code ok', async () => {
    //? Cuidado: existentProductId debe ser un id valido de producto en la base de datos.
    const existentProductId = 'a6198b26-2891-482e-bf61-4b3ec316e64f';

    const req = await request(app.getHttpServer())
      .get(`/products/${existentProductId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(req.status).toBe(HttpStatus.OK);
    expect(req.body).toBeInstanceOf(Object);
    // console.log(req.body);
  });

  it('GET /products/:id busca un producto por id, si no existe retorna un mensaje: El producto con id: ${id} no existe!', async () => {
    //? Cuidado: nonExistentProductId no debe existir en la base de datos.
    const nonExistentProductId = 'a6198b26-2891-482e-bf61-4b3ec316e640';

    // Realiza la solicitud para obtener el usuario por ID
    const getUserResponse = await request(app.getHttpServer())
      .get(`/products/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(getUserResponse.status).toBe(HttpStatus.NOT_FOUND);
    expect(getUserResponse.body.message).toBe(
      `El producto con id: ${nonExistentProductId} no existe`,
    );
  });
});
