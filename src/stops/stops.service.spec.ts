import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { StopsService } from 'stops/stops.service';
import { Stop } from 'entities/stop.entity';

describe('StopsService', () => {
  let service: StopsService;

  const mockStop = {
    stopId: '127',
    stopName: 'Times Sq-42 St',
  };
  const mockStopsRepository = {
    find: jest.fn().mockImplementation((): Promise<Stop[]> => {
      return Promise.resolve([mockStop as Stop]);
    }),
    findOne: jest.fn().mockImplementation((): Promise<Stop> => {
      return Promise.resolve(mockStop as Stop);
    }),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation((): Promise<Stop[]> => {
      return Promise.resolve([mockStop as Stop]);
    }),
    set: jest.fn().mockImplementation((): void => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StopsService,
        {
          provide: getRepositoryToken(Stop),
          useValue: mockStopsRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<StopsService>(StopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
