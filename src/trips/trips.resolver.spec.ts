import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from 'entities/trip.entity';
import { StopTime } from 'entities/stop-time.entity';
import { TripsResolver } from 'trips/trips.resolver';
import { TripsService } from 'trips/trips.service';
import { Calendar } from 'entities/calendar.entity';

describe('TripsResolver', () => {
  let resolver: TripsResolver;

  const mockCacheManager = {};
  const mockTripsRepository = {};
  const mockStopTimeRepository = {};
  const mockCalendarRepository = {};

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
        {
          provide: getRepositoryToken(StopTime),
          useValue: mockStopTimeRepository,
        },
        {
          provide: getRepositoryToken(Calendar),
          useValue: mockCalendarRepository,
        },
      ],
    }).compile();

    resolver = module.get<TripsResolver>(TripsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
