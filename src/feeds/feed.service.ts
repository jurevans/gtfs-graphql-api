import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { FeedInfo } from 'entities/feed-info.entity';
import { CacheKeyPrefix } from 'constants/';

@Injectable()
export class FeedService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(FeedInfo)
    private readonly feedRepository: Repository<FeedInfo>,
  ) {}

  public async findAll(): Promise<FeedInfo[]> {
    const feedsInCache: FeedInfo[] = await this.cacheManager.get(
      CacheKeyPrefix.FEEDS,
    );
    if (feedsInCache) {
      return feedsInCache;
    }

    const feeds: FeedInfo[] = await this.feedRepository.find({
      join: {
        alias: 'feed',
        leftJoinAndSelect: {
          agencies: 'feed.agencies',
          routes: 'feed.routes',
        },
      },
    });

    this.cacheManager.set(CacheKeyPrefix.FEEDS, feeds);
    return feeds;
  }
}
