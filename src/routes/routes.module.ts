import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RoutesService } from 'routes/routes.service';
import { RoutesResolver } from 'routes/routes.resolver';
import { CacheTtlSeconds } from 'constants/';
import { Route } from 'entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.THIRTY_SECONDS,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RoutesResolver, RoutesService],
})
export class RoutesModule {}
