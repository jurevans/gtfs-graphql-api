import { Test, TestingModule } from '@nestjs/testing';
import { TripsResolver } from './trips.resolver';
import { TripsService } from './trips.service';

describe('TripsResolver', () => {
  let resolver: TripsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsResolver, TripsService],
    }).compile();

    resolver = module.get<TripsResolver>(TripsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
