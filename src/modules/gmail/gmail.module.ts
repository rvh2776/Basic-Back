import { Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { GmailController } from './gmail.controller';

@Module({
  imports: [],
  controllers: [GmailController],
  providers: [GmailService],
  exports: [],
})
export class GmailModule {}
