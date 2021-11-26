import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Route } from 'entities/route.entity';
import { GetRouteArgs, GetRoutesArgs } from 'routes/routes.args';
import { CacheKeyPrefix } from 'constants/';
import { formatCacheKey } from 'util/';

@Injectable()
export class RoutesService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async getRoutes(args: GetRoutesArgs): Promise<Route[]> {
    const { feedIndex } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, { feedIndex });
    const routesInCache: Route[] = await this.cacheManager.get(key);

    if (routesInCache) {
      return routesInCache;
    }

    const routes: Route[] = await this.routeRepository.find({
      where: { feedIndex },
    });

    this.cacheManager.set(key, routes);
    return routes;
  }

  async getRoute(args: GetRouteArgs): Promise<Route> {
    const { feedIndex, routeId } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, { feedIndex, routeId });
    const routeInCache: Route = await this.cacheManager.get(key);
    if (routeInCache) {
      return routeInCache;
    }

    const route = await this.routeRepository.findOne({
      join: {
        alias: 'route',
        leftJoinAndSelect: {
          routeType: 'route.routeType',
          transfers: 'route.transfers',
        },
      },
      where: { feedIndex, routeId },
    });

    if (!route) {
      throw new NotFoundException(
        `Could not find route with feedIndex=${feedIndex} and routeId=${routeId}!`,
      );
    }

    this.cacheManager.set(key, route);
    return route;
  }
}
