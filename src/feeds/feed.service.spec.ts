import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { FeedInfo } from 'entities/feed-info.entity';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;

  const mockFeed = {
    feedIndex: 1,
  };
  const mockCacheManager = {};
  const mockFeedRepository = {
    find: jest.fn().mockImplementation((): Promise<FeedInfo[]> => {
      return Promise.resolve([mockFeed as FeedInfo]);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getRepositoryToken(FeedInfo),
          useValue: mockFeedRepository,
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
