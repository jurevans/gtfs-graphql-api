import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { FeedInfo } from 'entities/feed-info.entity';
import { Trips } from 'entities/trips.entity';

@Index('frequencies_pkey', ['feedIndex', 'startTime', 'tripId'], {
  unique: true,
})
@Entity('frequencies', { schema: 'gtfs' })
@ObjectType()
export class Frequencies {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'trip_id' })
  @Field()
  tripId: string;

  @Column('text', { primary: true, name: 'start_time' })
  @Field()
  startTime: string;

  @Column('text', { name: 'end_time' })
  @Field()
  endTime: string;

  @Column('integer', { name: 'headway_secs' })
  @Field(() => Int)
  headwaySecs: number;

  @Column('integer', { name: 'exact_times', nullable: true })
  @Field(() => Int, { nullable: true })
  exactTimes: number | null;

  @Column('integer', { name: 'start_time_seconds', nullable: true })
  @Field(() => Int, { nullable: true })
  startTimeSeconds: number | null;

  @Column('integer', { name: 'end_time_seconds', nullable: true })
  @Field(() => Int, { nullable: true })
  endTimeSeconds: number | null;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.frequencies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(() => Trips, (trips) => trips.frequencies)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'trip_id', referencedColumnName: 'tripId' },
  ])
  @Field(() => Trips)
  trips: Trips;
}
