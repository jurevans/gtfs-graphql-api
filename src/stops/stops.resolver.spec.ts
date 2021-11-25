import { Test, TestingModule } from '@nestjs/testing';
import { StopsResolver } from './stops.resolver';
import { StopsService } from './stops.service';

describe('StopsResolver', () => {
  let resolver: StopsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StopsResolver, StopsService],
    }).compile();

    resolver = module.get<StopsResolver>(StopsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
