import { Test, TestingModule } from '@nestjs/testing';
import { ShapesService } from 'shapes/shapes.service';

describe('ShapesService', () => {
  let service: ShapesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShapesService],
    }).compile();

    service = module.get<ShapesService>(ShapesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
