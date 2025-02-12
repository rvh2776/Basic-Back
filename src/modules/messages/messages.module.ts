import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/users.entity';
import { NodemailerModule } from '../nodemailer/nodemailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), NodemailerModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
