import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard)
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  getUploadImages(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    // return file;
    return this.filesService.uploadImages(file, folder);
  }
}
