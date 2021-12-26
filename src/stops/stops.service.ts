import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, IsNull, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Stop } from 'entities/stop.entity';
import { Transfer } from 'entities/transfer.entity';
import {
  GetStationsArgs,
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

  public async getStops(args: GetStopsArgs): Promise<Stop[]> {
    const { feedIndex, stopIds = [] } = args;
    const key = formatCacheKey(CacheKeyPrefix.STOPS, {
      feedIndex,
      stopIds: stopIds.join(','),
    });
    const stopsInCache: Stop[] = await this.cacheManager.get(key);

    if (stopsInCache) {
      return stopsInCache;
    }

    type Options = {
      where: {
        feedIndex?: number;
        stopId?: FindOperator<string>;
        parentStation?: FindOperator<string>;
      };
    };

    const options: Options = {
      where: {},
    };

    if (feedIndex) {
      options.where.feedIndex = feedIndex;
    }

    if (stopIds.length > 0) {
      options.where.stopId = In(stopIds);
    }

    const stops: Stop[] = await this.stopRepository.find(options);

    this.cacheManager.set(key, stops);
    return stops;
  }

  public async getStop(args: GetStopArgs): Promise<Stop> {
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

  public async getStopsByLocation(
    args: GetStopsByLocationArgs,
  ): Promise<Stop[]> {
    const { location, radius } = args;
    const key = formatCacheKey(CacheKeyPrefix.STOPS, {
      location: JSON.stringify(args),
    });
    const stopsInCache: Stop[] = await this.cacheManager.get(key);

    if (stopsInCache) {
      return stopsInCache;
    }

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

    const stopsByLocation = await qb.getMany();
    this.cacheManager.set(key, stopsByLocation, CacheTtlSeconds.ONE_HOUR);
    return stopsByLocation;
  }

  public async getTransfers(args: GetTransfersArgs) {
    const { feedIndex, stopIds } = args;
    const key = formatCacheKey(CacheKeyPrefix.TRANSFERS, {
      feedIndex,
      stopIds: stopIds.join(','),
    });

    const transfersInCache: Stop[] = await this.cacheManager.get(key);
    if (transfersInCache) {
      return transfersInCache;
    }

    const stations = await this.stopRepository.find({
      join: {
        alias: 'stop',
        leftJoinAndSelect: {
          transfers: 'stop.transfers',
        },
      },
      where: { feedIndex, stopId: In(stopIds) },
    });

    const transfers = stations.map((station: Stop) => station.transfers).flat();
    const toStopIds = transfers.map((transfer: Transfer) => transfer.toStopId);

    const stops = await this.stopRepository.find({
      where: {
        parentStation: In(toStopIds),
      },
    });
    this.cacheManager.set(key, stops, CacheTtlSeconds.ONE_WEEK);
    return stops;
  }

  public async getStations(getStationsArgs: GetStationsArgs): Promise<Stop[]> {
    const { feedIndex, stationIds = [] } = getStationsArgs;
    const key = formatCacheKey(CacheKeyPrefix.STATIONS, {
      feedIndex,
      stationIds: stationIds.join(','),
    });

    const stationsInCache: Stop[] = await this.cacheManager.get(key);
    if (stationsInCache) {
      return stationsInCache;
    }

    type Options = {
      where: {
        parentStation: FindOperator<string>;
        feedIndex?: number;
        stopId?: FindOperator<string>;
      };
      order: any;
    };

    const options: Options = {
      where: { parentStation: IsNull() },
      order: { feedIndex: 'ASC' },
    };

    if (feedIndex) {
      options.where.feedIndex = feedIndex;
    }

    if (stationIds.length > 0) {
      options.where.stopId = In(stationIds);
    }

    const stops = await this.stopRepository.find(options);
    this.cacheManager.set(key, stops, CacheTtlSeconds.ONE_DAY);
    return stops;
  }
}
