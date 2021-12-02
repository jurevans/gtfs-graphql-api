import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShapeGeom } from 'entities/shape-geom.entity';
import { ShapesResolver } from 'shapes/shapes.resolver';
import { ShapesService } from 'shapes/shapes.service';

describe('ShapesResolver', () => {
  let resolver: ShapesResolver;

  const mockCacheManager = {};
  const mockShapeGeomsRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShapesResolver,
        ShapesService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(ShapeGeom),
          useValue: mockShapeGeomsRepository,
        },
      ],
    }).compile();

    resolver = module.get<ShapesResolver>(ShapesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
