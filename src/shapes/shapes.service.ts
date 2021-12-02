import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { ShapeGeom } from 'entities/shape-geom.entity';
import { GetShapeArgs, GetShapesArgs } from 'shapes/shapes.args';
import { CacheKeyPrefix } from 'constants/';
import { formatCacheKey } from 'util/';

@Injectable()
export class ShapesService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(ShapeGeom)
    private readonly shapeGeomRepository: Repository<ShapeGeom>,
  ) {}

  async getShapes(args: GetShapesArgs): Promise<ShapeGeom[]> {
    const { shapeIds } = args;
    const key = formatCacheKey(CacheKeyPrefix.SHAPE, {
      shapeIds: shapeIds.join(','),
    });
    const shapesInCache: ShapeGeom[] = await this.cacheManager.get(key);

    if (shapesInCache && shapesInCache.length > 0) {
      return shapesInCache;
    }

    return this.shapeGeomRepository.find({
      where: {
        shapeId: In(shapeIds),
      },
    });
  }

  async getShape(args: GetShapeArgs): Promise<ShapeGeom> {
    const { shapeId } = args;
    const key = formatCacheKey(CacheKeyPrefix.SHAPE, { shapeId });
    const shapeInCache: ShapeGeom = await this.cacheManager.get(key);

    if (shapeInCache) {
      return shapeInCache;
    }

    const shape: ShapeGeom = await this.shapeGeomRepository.findOne({
      shapeId,
    });

    if (!shape) {
      throw new NotFoundException(
        `Could not find shape with shapeId = ${shapeId}`,
      );
    }

    this.cacheManager.set(key, shape);
    return shape;
  }
}
