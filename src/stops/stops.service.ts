import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, IsNull, Not, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Stop } from 'entities/stop.entity';
import { GetStopArgs, GetStopsArgs } from 'stops/stops.args';
import { CacheKeyPrefix } from 'constants/';
import { formatCacheKey } from 'util/';

@Injectable()
export class StopsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Stop)
    private readonly stopRepository: Repository<Stop>,
  ) {}

  async getStops(args: GetStopsArgs): Promise<Stop[]> {
    const { feedIndex, isParent, isChild, stopIds = [] } = args;
    const key = formatCacheKey(CacheKeyPrefix.STOPS, {
      feedIndex,
      isParent,
      isChild,
      stopIds: stopIds.join(','),
    });
    const stopsInCache: Stop[] = await this.cacheManager.get(key);

    if (stopsInCache) {
      return stopsInCache;
    }

    type Options = {
      where: {
        feedIndex: number;
        parentStation?: FindOperator<string>;
        stopId?: FindOperator<string>;
      };
    };

    const options: Options = {
      where: {
        feedIndex,
      },
    };

    if (isParent) {
      options.where.parentStation = IsNull();
    }

    if (isChild) {
      options.where.parentStation = Not(IsNull());
    }

    if (stopIds.length > 0) {
      options.where.stopId = In(stopIds);
    }

    const stops: Stop[] = await this.stopRepository.find(options);

    this.cacheManager.set(key, stops);
    return stops;
  }

  async getStop(args: GetStopArgs): Promise<Stop> {
    const { feedIndex, stopId } = args;
    const key = formatCacheKey(CacheKeyPrefix.STOPS, { feedIndex, stopId });
    const stopInCache: Stop = await this.cacheManager.get(key);
    if (stopInCache) {
      return stopInCache;
    }

    const stop = await this.stopRepository.findOne({
      join: {
        alias: 'stop',
        leftJoinAndSelect: {
          transfers: 'stop.transfers',
          locationType: 'stop.locationType',
          transferType: 'transfers.transferType',
        },
      },
      where: { feedIndex, stopId },
    });

    if (!stop) {
      throw new NotFoundException(
        `Could not find stop with feedIndex=${feedIndex} and stopId=${stopId}!`,
      );
    }

    this.cacheManager.set(key, stop);
    return stop;
  }
}
