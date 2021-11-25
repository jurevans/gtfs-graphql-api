import { Test, TestingModule } from '@nestjs/testing';
import { StopsService } from './stops.service';

describe('StopsService', () => {
  let service: StopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StopsService],
    }).compile();

    service = module.get<StopsService>(StopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
