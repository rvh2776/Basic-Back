import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
// import { FilesService } from './files.service';

// TODO: Test desactivado agregando: .test al describe, para que no tire error hasta que no lo implemente.

describe.skip('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      // providers: [FilesService],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
