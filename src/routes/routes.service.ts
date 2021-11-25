import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from 'entities/route.entity';
import { Cache } from 'cache-manager';
import { CacheKeyPrefix } from 'constants/';
import { GetRouteArgs, GetRoutesArgs } from './route.args';

@Injectable()
export class RoutesService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async findAll(args: GetRoutesArgs): Promise<Route[]> {
    const { feedIndex } = args;

    const routesInCache: Route[] = await this.cacheManager.get(
      CacheKeyPrefix.ROUTES,
    );
    if (routesInCache) {
      return routesInCache;
    }

    const routes: Route[] = await this.routeRepository.find({
      join: {
        alias: 'route',
        leftJoinAndSelect: {
          routeType: 'route.routeType',
          transfers: 'route.transfers',
        },
      },
      where: { feedIndex },
    });
    this.cacheManager.set(CacheKeyPrefix.ROUTES, routes);
    return routes;
  }

  async find(args: GetRouteArgs): Promise<Route> {
    const { feedIndex, routeId } = args;
    const key = `${CacheKeyPrefix.ROUTES}?routeId=${routeId}`;
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
