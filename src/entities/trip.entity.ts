import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Frequency } from 'entities/frequency.entity';
import { StopTime } from 'entities/stop-time.entity';
import { Calendar } from 'entities/calendar.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { Route } from 'entities/route.entity';
import { Shape } from 'entities/shape.entity';
import { WheelchairAccessible } from 'entities/wheelchair-accessible.entity';

@Index('trips_pkey', ['feedIndex', 'tripId'], { unique: true })
@Index('trips_service_id', ['feedIndex', 'serviceId'], {})
@Index('trips_trip_id', ['tripId'], {})
@Entity('trips', { schema: 'gtfs' })
@ObjectType()
export class Trip {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { name: 'route_id' })
  @Field({ nullable: true })
  routeId: string;

  @Column('text', { name: 'service_id' })
  @Field({ nullable: true })
  serviceId: string;

  @Column('text', { primary: true, name: 'trip_id' })
  @Field({ nullable: true })
  tripId: string;

  @Column('text', { name: 'trip_headsign', nullable: true })
  @Field({ nullable: true })
  tripHeadsign: string | null;

  @Column('integer', { name: 'direction_id', nullable: true })
  @Field({ nullable: true })
  directionId: number | null;

  @Column('text', { name: 'block_id', nullable: true })
  @Field({ nullable: true })
  blockId: string | null;

  @Column('text', { name: 'shape_id', nullable: true })
  @Field({ nullable: true })
  shapeId: string | null;

  @Column('text', { name: 'trip_short_name', nullable: true })
  @Field({ nullable: true })
  tripShortName: string | null;

  @Column('text', { name: 'direction', nullable: true })
  @Field({ nullable: true })
  direction: string | null;

  @Column('text', { name: 'schd_trip_id', nullable: true })
  @Field({ nullable: true })
  schdTripId: string | null;

  @Column('text', { name: 'trip_type', nullable: true })
  @Field({ nullable: true })
  tripType: string | null;

  @Column('integer', { name: 'exceptional', nullable: true })
  @Field(() => Int, { nullable: true })
  exceptional: number | null;

  @Column('integer', { name: 'bikes_allowed', nullable: true })
  @Field(() => Int, { nullable: true })
  bikesAllowed: number | null;

  @OneToMany(() => Frequency, (frequency) => frequency.trip)
  @Field(() => [Frequency])
  frequencies: Frequency[];

  @OneToMany(() => StopTime, (stopTime) => stopTime.trip)
  @Field(() => [StopTime])
  stopTimes: StopTime[];

  @ManyToOne(() => Calendar, (calendar) => calendar.trips)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  @Field(() => Calendar)
  calendar: Calendar;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.trips, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(() => Route, (route) => route.trips)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'route_id', referencedColumnName: 'routeId' },
  ])
  @Field(() => Route)
  route: Route;

  @ManyToOne(() => Shape)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'shape_id', referencedColumnName: 'shapeId' },
  ])
  @Field(() => Shape)
  shape: Shape;

  @ManyToOne(
    () => WheelchairAccessible,
    (wheelchairAccessible) => wheelchairAccessible.trips,
  )
  @JoinColumn([
    {
      name: 'wheelchair_accessible',
      referencedColumnName: 'wheelchairAccessible',
    },
  ])
  @Field(() => WheelchairAccessible)
  wheelchairAccessible: WheelchairAccessible;
}
