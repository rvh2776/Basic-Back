import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersMock } from './users.mock';
import { User } from '../../users/entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async seed() {
    console.log('Seed users inicializado');

    for (const userMock of UsersMock) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userMock.email },
      });

      if (existingUser) {
        console.log(
          `Usuario ${existingUser.email} ya existe, saltando creación.`,
        );
        continue;
      }

      const hashedPassword = await bcrypt.hash(userMock.password, 10);
      const user = new User();
      Object.assign(user, userMock);
      user.password = hashedPassword;

      await this.usersRepository.save(user);

      console.log('Usuario creado: ', user.name);
    }
  }
}
