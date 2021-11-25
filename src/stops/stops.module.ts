import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { StopsService } from './stops.service';
import { StopsResolver } from './stops.resolver';
import { Stop } from 'entities/stop.entity';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stop]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.ONE_HOUR,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StopsResolver, StopsService],
})
export class StopsModule {}
