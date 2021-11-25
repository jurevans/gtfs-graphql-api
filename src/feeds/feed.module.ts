import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { FeedInfo } from 'entities/feed-info.entity';
import { CacheTtlSeconds } from 'constants/';
import { FeedResolver } from 'feeds/feed.resolver';
import { FeedService } from 'feeds/feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedInfo]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.ONE_HOUR,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
  providers: [FeedService, FeedResolver],
})
export class FeedModule {}
