import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../../common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, CloudinaryService],
  exports: [],
})
export class AuthModule {}
