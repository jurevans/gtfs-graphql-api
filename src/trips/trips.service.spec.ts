import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { TripsService } from 'trips/trips.service';
import { Trip } from 'entities/trip.entity';
import { StopTime } from 'entities/stop-time.entity';
import { Calendar } from 'entities/calendar.entity';

describe('TripsService', () => {
  let service: TripsService;

  const mockTrip = {
    tripId: 'A',
  };

  const mockStopTime = {};
  const mockCalendar = {};

  const mockTripsRepository = {
    find: jest.fn().mockImplementation((): Promise<Trip[]> => {
      return Promise.resolve([mockTrip as Trip]);
    }),
    findOne: jest.fn().mockImplementation((): Promise<Trip> => {
      return Promise.resolve(mockTrip as Trip);
    }),
  };

  const mockStopTimeRepository = {
    findOne: jest.fn().mockImplementation((): Promise<StopTime> => {
      return Promise.resolve(mockStopTime as StopTime);
    }),
  };

  const mockCalendarRepository = {
    getMany: jest.fn().mockImplementation((): Promise<Calendar[]> => {
      return Promise.resolve([mockCalendar as Calendar]);
    }),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation((): Promise<Trip[]> => {
      return Promise.resolve([mockTrip as Trip]);
    }),
    set: jest.fn().mockImplementation((): void => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
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
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
