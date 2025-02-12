import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryConfig } from '../../config/cloudinary';
import { CloudinaryService } from '../../common/cloudinary.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryConfig, CloudinaryService],
  exports: [],
})
export class FilesModule {}
