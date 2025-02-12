import { Module, OnModuleInit } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { UsersSeed } from './users/users.seed';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersSeed],
  exports: [UsersSeed],
})
// export class SeedsModule {}
export class SeedsModule implements OnModuleInit {
  constructor(private readonly usersSeed: UsersSeed) {}
  async onModuleInit() {
    await this.usersSeed.seed();
  }
}
