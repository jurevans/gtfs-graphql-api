import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { RoutesService } from 'routes/routes.service';
import { Route } from 'entities/route.entity';

describe('RoutesService', () => {
  let service: RoutesService;

  const mockRoute = {
    routeId: 'A',
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
