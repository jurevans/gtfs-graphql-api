import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { RoutesService } from 'routes/routes.service';
import { Route } from 'entities/route.entity';

describe('RoutesService', () => {
  let service: RoutesService;

  const mockRoute = {
    routeId: '1',
    routeDesc: 'Trains operate between 242 St and South Ferry at all times',
    routeColor: 'EE352E',
    routeShortName: '1',
    routeLongName: 'Broadway - 7 Avenue Local',
    routeUrl: 'http://web.mta.info/nyct/service/pdf/t1cur.pdf',
  };

  const mockRoutesRepository = {
    find: jest.fn().mockImplementation((): Promise<Route[]> => {
      return Promise.resolve([mockRoute as Route]);
    }),
    findOne: jest.fn().mockImplementation((): Promise<Route> => {
      return Promise.resolve(mockRoute as Route);
    }),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation((): Promise<Route[]> => {
      return Promise.resolve([mockRoute as Route]);
    }),
    set: jest.fn().mockImplementation((): void => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: getRepositoryToken(Route),
          useValue: mockRoutesRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
