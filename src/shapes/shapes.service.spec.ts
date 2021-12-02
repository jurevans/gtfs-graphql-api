import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { ShapesService } from 'shapes/shapes.service';
import { ShapeGeom } from 'entities/shape-geom.entity';

describe('ShapesService', () => {
  let service: ShapesService;

  const mockShapeGeom: ShapeGeom = {
    feedIndex: 1,
    shapeId: '7..N97R',
    length: 1,
    shape: null,
    geom: {
      type: 'LineString',
      coordinates: [],
    },
  };

  const mockShapeGeomsRepository = {
    find: jest.fn().mockImplementation((): Promise<ShapeGeom[]> => {
      return Promise.resolve([mockShapeGeom]);
    }),
    findOne: jest.fn().mockImplementation((): Promise<ShapeGeom> => {
      return Promise.resolve(mockShapeGeom);
    }),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation((): Promise<ShapeGeom[]> => {
      return Promise.resolve([mockShapeGeom]);
    }),
    set: jest.fn().mockImplementation((): void => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShapesService,
        {
          provide: getRepositoryToken(ShapeGeom),
          useValue: mockShapeGeomsRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ShapesService>(ShapesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
