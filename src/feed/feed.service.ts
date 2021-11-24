import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedInfo } from 'entities/feed-info.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedInfo)
    private readonly feedRepository: Repository<FeedInfo>,
  ) {}

  public async findAll() {
    return await this.feedRepository.find({
      join: {
        alias: 'feed',
        leftJoinAndSelect: {
          agencies: 'feed.agencies',
        },
      },
    });
  }
}
