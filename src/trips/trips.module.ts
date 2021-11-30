import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { TripsService } from 'trips/trips.service';
import { TripsResolver } from 'trips/trips.resolver';
import { Trip } from 'entities/trip.entity';
import { StopTime } from 'entities/stop-time.entity';
import { Calendar } from 'entities/calendar.entity';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, StopTime, Calendar]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.ONE_HOUR,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TripsResolver, TripsService],
})
export class TripsModule {}
