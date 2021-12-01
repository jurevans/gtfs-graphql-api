import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { DateTime } from 'luxon';
import { Trip } from 'entities/trip.entity';
import { GetNextTripArgs, GetTripArgs, GetTripsArgs } from 'trips/trips.args';
import { CacheKeyPrefix, CacheTtlSeconds } from 'constants/';
import { formatCacheKey, getDayOfWeekForTimezone } from 'util/';
import { StopTime } from 'entities/stop-time.entity';
import { Calendar } from 'entities/calendar.entity';
import * as PostgresInterval from 'postgres-interval';

@Injectable()
export class TripsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(StopTime)
    private readonly stopTimeRepository: Repository<StopTime>,
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
      .where('t.feedIndex = :feedIndex', { feedIndex });

    if (routeId) {
      tripsQB.andWhere('t.routeId = :routeId', { routeId });
    }

    if (serviceId) {
      tripsQB.andWhere('t.serviceId = :serviceId', { serviceId });
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

    const trip = await this.tripRepository
      .createQueryBuilder('t')
      .where('t.feedIndex = :feedIndex', { feedIndex })
      .andWhere('t.tripId = :tripId', { tripId })
      .leftJoinAndSelect('t.route', 'route')
      .leftJoinAndSelect('t.stopTimes', 'stopTimes')
      .leftJoinAndSelect('stopTimes.stop', 'stop')
      .leftJoinAndSelect('stop.locationType', 'locationType')
      .orderBy('stopTimes.stopSequence', 'ASC')
      .getOne();

    if (!trip) {
      throw new NotFoundException(
        `Could not find trip with feedIndex=${feedIndex} and tripId=${tripId}!`,
      );
    }

    this.cacheManager.set(key, trip, { ttl: CacheTtlSeconds.THIRTY_SECONDS });
    return trip;
  }

  async getNextTrip(args: GetNextTripArgs): Promise<Trip> {
    const { feedIndex, routeId, directionId } = args;
    const zone = 'America/New_York';
    const isoTime = DateTime.now()
      .setZone(zone)
      .toLocaleString(DateTime.TIME_24_WITH_SECONDS);
    const interval = PostgresInterval(isoTime).toPostgres();

    // Collect serviceIds for current date in calendar
    const today = getDayOfWeekForTimezone(zone);
    const calendarQB = this.calendarRepository
      .createQueryBuilder('c')
      .select(['c.serviceId'])
      .where(`c.${today}=1`)
      .andWhere('c.feedIndex=:feedIndex', { feedIndex });

    const serviceIds: string[] = await (
      await calendarQB.getMany()
    ).map((calendar: Calendar) => calendar.serviceId);

    const qb = this.stopTimeRepository
      .createQueryBuilder('st')
      .innerJoin('st.trip', 't')
      .where('st.feedIndex = :feedIndex', { feedIndex })
      .andWhere('st.stopSequence = 1')
      .andWhere(`st.departure_time > interval '${interval}'`)
      .andWhere('t.routeId = :routeId', { routeId })
      .andWhere('t.directionId = :directionId', { directionId });

    if (serviceIds.length > 0) {
      // Query only within valid serviceIds
      qb.andWhere('t.serviceId  IN (:...serviceIds)', { serviceIds });
    }

    const stopTime = await qb.getOne();

    if (!stopTime) {
      throw new NotFoundException(
        `Could not find stop times for route = ${routeId} and feedIndex = ${feedIndex}`,
      );
    }
    const { tripId } = stopTime;

    return this.getTrip({ tripId, feedIndex });
  }
}
