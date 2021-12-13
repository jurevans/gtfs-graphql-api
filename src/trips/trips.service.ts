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
import { GetNextTripsArgs, GetTripArgs, GetTripsArgs } from 'trips/trips.args';
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
    const { feedIndex, routeId, tripIds = [] } = args;
    const key = formatCacheKey(CacheKeyPrefix.ROUTES, {
      feedIndex,
      routeId,
      tripIds: tripIds.join(','),
    });
    const tripsInCache: Trip[] = await this.cacheManager.get(key);

    if (tripsInCache) {
      return tripsInCache;
    }

    const qb = this.tripRepository
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.stopTimes', 'stopTimes')
      .innerJoinAndSelect('stopTimes.stop', 'stop')
      .innerJoinAndSelect('stop.locationType', 'locationType')
      .where('t.feedIndex = :feedIndex', { feedIndex })
      .orderBy('stopTimes.stopSequence, stopTimes.departureTime', 'ASC');

    if (routeId) {
      qb.andWhere('t.routeId = :routeId', { routeId });
    }

    if (tripIds.length > 0) {
      qb.andWhere('t.tripId IN(:...tripIds)', { tripIds });
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

    const qb = this.tripRepository
      .createQueryBuilder('t')
      .where('t.tripId = :tripId', { tripId })
      .leftJoinAndSelect('t.route', 'route')
      .leftJoinAndSelect('t.stopTimes', 'stopTimes')
      .leftJoinAndSelect('stopTimes.stop', 'stop')
      .leftJoinAndSelect('stop.locationType', 'locationType')
      .orderBy('stopTimes.stopSequence', 'ASC');

    if (feedIndex) {
      qb.andWhere('t.feedIndex = :feedIndex', { feedIndex });
    }

    const trip = await qb.getOne();
    if (!trip) {
      throw new NotFoundException(
        `Could not find trip with feedIndex=${feedIndex} and tripId=${tripId}!`,
      );
    }

    this.cacheManager.set(key, trip, { ttl: CacheTtlSeconds.THIRTY_SECONDS });
    return trip;
  }

  async getNextTrips(args: GetNextTripsArgs): Promise<Trip[]> {
    const { feedIndex, routeId } = args;

    // Get current time as PostgreSQL Interval
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

    const serviceIds: string[] = (await calendarQB.getMany()).map(
      (calendar: Calendar) => calendar.serviceId,
    );

    // Get the tripId for the next available trip:
    const qb = this.stopTimeRepository
      .createQueryBuilder('st')
      .innerJoin('st.trip', 't')
      .where('st.stopSequence = 1')
      .andWhere(`st.departure_time >= interval '${interval}'`)
      .andWhere('t.routeId = :routeId', { routeId });

    if (feedIndex) {
      qb.andWhere('st.feedIndex = :feedIndex', { feedIndex });
    }

    if (serviceIds.length > 0) {
      // Query only within valid serviceIds
      qb.andWhere('t.serviceId  IN (:...serviceIds)', { serviceIds });
    }

    qb.limit(10);

    const nextTrips = await qb.getMany();

    if (!nextTrips) {
      throw new NotFoundException(
        `Could not find stop times for route = ${routeId} and feedIndex = ${feedIndex}`,
      );
    }

    return this.getTrips({
      feedIndex,
      tripIds: nextTrips.map((stopTime) => stopTime.tripId),
    });
  }
}
