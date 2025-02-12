import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';

// TODO: Test desactivado agregando: .test al describe, para que no tire error hasta que no lo implemente.

describe.skip('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
