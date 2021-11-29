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
import { formatCacheKey, getDayOfWeekForTimezone } from 'util/';
import { Calendar } from 'entities/calendar.entity';

@Injectable()
export class TripsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
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

    const tripsQB = this.tripRepository
      .createQueryBuilder('t')
      .where('t.feedIndex=:feedIndex', { feedIndex });

    if (routeId) {
      tripsQB.andWhere('t.routeId = :routeId', { routeId });
    }

    if (serviceId) {
      tripsQB.andWhere('t.serviceId = :serviceId', { serviceId });
    } else {
      // Collect serviceIds for current date in calendar
      const today = getDayOfWeekForTimezone('America/New_York');
      const calendarQB = this.calendarRepository
        .createQueryBuilder('c')
        .select(['c.serviceId'])
        .where(`c.${today}=1`)
        .andWhere('c.feedIndex=:feedIndex', { feedIndex });

      const serviceIds: string[] = await (
        await calendarQB.getMany()
      ).map((calendar: Calendar) => calendar.serviceId);

      if (serviceIds.length > 0) {
        tripsQB.andWhere('t.serviceId IN (:...serviceIds)', { serviceIds });
      }
    }

    const trips: Trip[] = await tripsQB.getMany();
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
