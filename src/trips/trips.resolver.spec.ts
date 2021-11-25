import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from 'entities/trip.entity';
import { TripsResolver } from './trips.resolver';
import { TripsService } from './trips.service';

describe('TripsResolver', () => {
  let resolver: TripsResolver;

  const mockCacheManager = {};
  const mockTripsRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsResolver,
        TripsService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(Trip),
          useValue: mockTripsRepository,
        },
      ],
    }).compile();

    resolver = module.get<TripsResolver>(TripsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
