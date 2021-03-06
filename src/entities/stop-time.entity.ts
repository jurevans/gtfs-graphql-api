import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IPostgresInterval } from 'postgres-interval';
import { ContinuousPickup } from 'entities/continuous-pickup.entity';
import { PickupDropoffTypes } from 'entities/pickup-dropoff-types.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { Stop } from 'entities/stop.entity';
import { Trip } from 'entities/trip.entity';
import { Timepoint } from 'entities/timepoint.entity';
import { Interval } from 'entities/interval.entity';
import { intervalToTime } from 'transformers';

@Index('arr_time_index', ['arrivalTimeSeconds'], {})
@Index('dep_time_index', ['departureTimeSeconds'], {})
@Index('stop_times_pkey', ['feedIndex', 'stopSequence', 'tripId'], {
  unique: true,
})
@Index('stop_times_key', ['feedIndex', 'stopId', 'tripId'], {})
@Entity('stop_times', { schema: 'gtfs' })
@ObjectType()
export class StopTime {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'trip_id' })
  @Field({ nullable: true })
  tripId: string;

  @Column('interval', { name: 'arrival_time', nullable: true })
  @Field(() => Interval, { nullable: true })
  arrivalTime: IPostgresInterval | null;

  @Column('text', {
    name: 'departure_time',
    nullable: true,
    transformer: intervalToTime,
  })
  @Field(() => String, { nullable: true })
  arrival: string | null;

  @Column('interval', { name: 'departure_time', nullable: true })
  @Field(() => Interval, { nullable: true })
  departureTime: IPostgresInterval | null;

  @Column('text', {
    name: 'departure_time',
    nullable: true,
    transformer: intervalToTime,
  })
  @Field(() => String, { nullable: true })
  departure: string | null;

  @Column('text', { name: 'stop_id', nullable: true })
  @Field({ nullable: true })
  stopId: string | null;

  @Column('integer', { primary: true, name: 'stop_sequence' })
  @Field(() => Int, { nullable: true })
  stopSequence: number;

  @Column('text', { name: 'stop_headsign', nullable: true })
  @Field({ nullable: true })
  stopHeadsign: string | null;

  @Column('numeric', {
    name: 'shape_dist_traveled',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  shapeDistTraveled: number | null;

  @Column('integer', { name: 'continuous_drop_off', nullable: true })
  @Field(() => Int, { nullable: true })
  continuousDropOff: number | null;

  @Column('integer', { name: 'arrival_time_seconds', nullable: true })
  @Field(() => Int, { nullable: true })
  arrivalTimeSeconds: number | null;

  @Column('integer', { name: 'departure_time_seconds', nullable: true })
  @Field(() => Int, { nullable: true })
  departureTimeSeconds: number | null;

  @ManyToOne(
    () => ContinuousPickup,
    (continuousPickup) => continuousPickup.stopTimes,
  )
  @JoinColumn([
    { name: 'continuous_pickup', referencedColumnName: 'continuousPickup' },
  ])
  @Field(() => ContinuousPickup)
  continuousPickup: ContinuousPickup;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.stopTimes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(() => Stop, (stop) => stop.stopTimes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'stop_id', referencedColumnName: 'stopId' },
  ])
  @Field(() => Stop)
  stop: Stop;

  @ManyToOne(() => Trip, (trip) => trip.stopTimes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'trip_id', referencedColumnName: 'tripId' },
  ])
  @Field(() => Trip)
  trip: Trip;

  @ManyToOne(
    () => PickupDropoffTypes,
    (pickupDropoffTypes) => pickupDropoffTypes.stopTimesByDropoffType,
  )
  @JoinColumn([{ name: 'drop_off_type', referencedColumnName: 'typeId' }])
  @Field(() => PickupDropoffTypes)
  dropOffType: PickupDropoffTypes;

  @ManyToOne(
    () => PickupDropoffTypes,
    (pickupDropoffTypes) => pickupDropoffTypes.stopTimesByPickupType,
  )
  @JoinColumn([{ name: 'pickup_type', referencedColumnName: 'typeId' }])
  @Field(() => PickupDropoffTypes)
  pickupType: PickupDropoffTypes;

  @ManyToOne(() => Timepoint, (timepoint) => timepoint.stopTimes)
  @JoinColumn([{ name: 'timepoint', referencedColumnName: 'timepoint' }])
  @Field(() => Timepoint)
  timepoint: Timepoint;
}
