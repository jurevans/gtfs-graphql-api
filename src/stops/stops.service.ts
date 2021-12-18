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
import { Transfer } from 'entities/transfer.entity';
import {
  GetStopArgs,
  GetStopsArgs,
  GetStopsByLocationArgs,
  GetTransfersArgs,
} from 'stops/stops.args';
import { CacheKeyPrefix, CacheTtlSeconds } from 'constants/';
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

  async getStopsByLocation(args: GetStopsByLocationArgs): Promise<Stop[]> {
    const { location, radius } = args;

    const qb = this.stopRepository
      .createQueryBuilder('stops')
      .select([
        'stops.feedIndex',
        'stops.stopId',
        'stops.stopName',
        'stops.geom',
      ])
      .where(
        `ST_DWithin (stops.geom,
          ST_SetSRID(
            ST_MakePoint(${location[0]}, ${location[1]}),
            4326
          ),
          ${radius}
        )`,
      )
      .andWhere('stops.parentStation IS NULL');
    return qb.getMany();
  }

  async getTransfers(args: GetTransfersArgs) {
    const { feedIndex, parentStation } = args;
    const key = formatCacheKey(CacheKeyPrefix.TRANSFERS, {
      feedIndex,
      parentStation,
    });

    const transfersInCache: Stop[] = await this.cacheManager.get(key);
    if (transfersInCache) {
      return transfersInCache;
    }

    const station = await this.stopRepository.findOne({
      join: {
        alias: 'stop',
        leftJoinAndSelect: {
          transfers: 'stop.transfers',
        },
      },
      where: { feedIndex, stopId: parentStation },
    });

    if (!station) {
      throw new NotFoundException(
        `Could not find station with feedIndex=${feedIndex} and stopId=${parentStation}!`,
      );
    }

    const { transfers } = station;
    const toStopIds = transfers.map((transfer: Transfer) => transfer.toStopId);

    const stops = await this.stopRepository.find({
      where: {
        parentStation: In(toStopIds),
      },
    });
    this.cacheManager.set(key, stops, CacheTtlSeconds.ONE_WEEK);
    return stops;
  }
}
