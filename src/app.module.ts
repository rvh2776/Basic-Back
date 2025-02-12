import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './modules/files/files.module';
import { JwtModule } from '@nestjs/jwt';
import { SeedsModule } from './modules/seeds/seeds.module';
import { MessagesModule } from './modules/messages/messages.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { NodemailerModule } from './modules/nodemailer/nodemailer.module';
import { GmailModule } from './modules/gmail/gmail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      global: true,
    }),

    UsersModule,
    AuthModule,
    FilesModule,
    SeedsModule,
    MessagesModule,
    StatisticsModule,
    NodemailerModule,
    GmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
