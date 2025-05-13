// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity';

const testTypeOrmConfig = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5432,
  username: 'auth_db_user',
  password: 'auth_db_password',
  database: 'auth_db',
  entities: [User],
  synchronize: true, 
};

describe('Тесты e2e', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeOrmConfig),
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    const testUser = {
      email: 'test@test.com',
      password: '123456',
    };

    it('POST /register', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', testUser.email);
        });
    });

    it('POST /register', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send(testUser)
        .expect(409);
    });

    it('POST /login', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          authToken = res.body.access_token;
        });
    });

    it('POST /login', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          email: testUser.email,
          password: '654321',
        })
        .expect(401);
    });

    it('GET /users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('email');
          expect(res.body[0]).toHaveProperty('id');
        });
    });

    it('GET /users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('GET /users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });
});