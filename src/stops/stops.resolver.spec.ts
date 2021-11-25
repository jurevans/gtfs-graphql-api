import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stop } from 'entities/stop.entity';
import { StopsResolver } from 'stops/stops.resolver';
import { StopsService } from 'stops/stops.service';

describe('StopsResolver', () => {
  let resolver: StopsResolver;

  const mockCacheManager = {};
  const mockStopsRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StopsResolver,
        StopsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(Stop),
          useValue: mockStopsRepository,
        },
      ],
    }).compile();

    resolver = module.get<StopsResolver>(StopsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
