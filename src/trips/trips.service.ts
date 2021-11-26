import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Trip } from 'entities/trip.entity';
import { GetTripArgs, GetTripsArgs } from 'trips/trips.args';
import { CacheKeyPrefix } from 'constants/';
import { formatCacheKey } from 'util/';

@Injectable()
export class TripsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async getTrips(args: GetTripsArgs): Promise<Trip[]> {
    const { feedIndex, routeId } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, { feedIndex, routeId });
    const tripsInCache: Trip[] = await this.cacheManager.get(key);

    if (tripsInCache) {
      return tripsInCache;
    }

    type Options = {
      where: {
        feedIndex: number;
        routeId?: string;
      };
    };

    const options: Options = {
      where: { feedIndex },
    };

    if (routeId) {
      options.where.routeId = routeId;
    }

    const trips: Trip[] = await this.tripRepository.find(options);

    this.cacheManager.set(key, trips);
    return trips;
  }

  async getTrip(args: GetTripArgs): Promise<Trip> {
    const { feedIndex, tripId } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, { feedIndex, tripId });
    const tripInCache: Trip = await this.cacheManager.get(key);
    if (tripInCache) {
      return tripInCache;
    }

    const trip = await this.tripRepository.findOne({
      where: { feedIndex, tripId },
      join: {
        alias: 'trip',
        leftJoinAndSelect: {
          route: 'trip.route',
          stopTimes: 'trip.stopTimes',
          shape: 'trip.shape',
          shapegeom: 'shape.shapeGeom',
          stop: 'stopTimes.stop',
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(
        `Could not find trip with feedIndex=${feedIndex} and tripId=${tripId}!`,
      );
    }

    this.cacheManager.set(key, trip);
    return trip;
  }
}
