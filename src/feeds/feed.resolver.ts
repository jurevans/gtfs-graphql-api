import { Query, Resolver } from '@nestjs/graphql';
import { FeedService } from 'feeds/feed.service';
import { FeedInfo } from 'entities/feed-info.entity';

@Resolver(() => FeedInfo)
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => [FeedInfo])
  feeds() {
    return this.feedService.findAll();
  }
}
