import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Route } from 'entities/route.entity';
import { RoutesResolver } from './routes.resolver';
import { RoutesService } from './routes.service';

describe('RoutesResolver', () => {
  let resolver: RoutesResolver;

  const mockCacheManager = {};
  const mockRoutesRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesResolver,
        RoutesService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(Route),
          useValue: mockRoutesRepository,
        },
      ],
    }).compile();

    resolver = module.get<RoutesResolver>(RoutesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
