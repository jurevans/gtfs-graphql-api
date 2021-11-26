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
import { formatCacheKey, getCurrentDay } from 'util/';

@Injectable()
export class TripsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async getTrips(args: GetTripsArgs): Promise<Trip[]> {
    const { feedIndex, routeId, serviceId } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, {
      feedIndex,
      routeId,
      serviceId,
    });
    const tripsInCache: Trip[] = await this.cacheManager.get(key);

    if (tripsInCache) {
      return tripsInCache;
    }

    const today = getCurrentDay();
    const qb = this.tripRepository
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.calendar', 'calendar')
      .where('t.feedIndex=:feedIndex', { feedIndex })
      .andWhere(`calendar.${today} = 1`);

    if (routeId) {
      qb.andWhere('t.routeId = :routeId', { routeId });
    }

    if (serviceId) {
      qb.andWhere('t.serviceId = :serviceId', { serviceId });
    }

    const trips: Trip[] = await qb.getMany();
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
