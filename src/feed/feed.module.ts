import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedInfo } from 'entities/feed-info.entity';
import { FeedResolver } from './feed.resolver';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedInfo])],
  exports: [TypeOrmModule],
  providers: [FeedService, FeedResolver],
})
export class FeedModule {}
