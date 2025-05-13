import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'auth_db_user',
  password: 'auth_db_password',
  database: 'auth_db',
  entities: [User],
  synchronize: true,
};