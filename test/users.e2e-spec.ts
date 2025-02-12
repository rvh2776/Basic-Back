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
      .send({ email: 'example@test.com', password: 'Password123!' });

    jwtToken = response.body.token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('Get /users/ retorna un array de usuarios y status code ok', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/ retorna un usuario por id y status code ok', async () => {
    //? Cuidado: existentUserId debe ser un id valido de usuario en la base de datos.
    const existentUserId = '301a99f7-4cc9-45c1-95e7-33f094896fd1';

    const req = await request(app.getHttpServer())
      .get(`/users/${existentUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(req.status).toBe(HttpStatus.OK);
    expect(req.body).toBeInstanceOf(Object);
    // console.log(req.body);
  });

  it('GET /users/:id busca usuario por id, si no existe retorna un mensaje: El usuario con id: ${id} no existe!', async () => {
    //? Cuidado: nonExistentUserId no debe existir en la base de datos.
    const nonExistentUserId = '87cecae9-fb7c-4046-a878-1aabcdb83f20';

    // Realiza la solicitud para obtener el usuario por ID
    const getUserResponse = await request(app.getHttpServer())
      .get(`/users/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(getUserResponse.status).toBe(HttpStatus.NOT_FOUND);
    expect(getUserResponse.body.message).toBe(
      `El usuario con id: ${nonExistentUserId} no existe`,
    );
  });
});
