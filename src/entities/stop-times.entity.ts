import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ContinuousPickup } from 'entities/continuous-pickup.entity';
import { PickupDropoffTypes } from 'entities/pickup-dropoff-types.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { Stops } from 'entities/stops.entity';
import { Trips } from 'entities/trips.entity';
import { Timepoints } from 'entities/timepoints.entity';

@Index('arr_time_index', ['arrivalTimeSeconds'], {})
@Index('dep_time_index', ['departureTimeSeconds'], {})
@Index('stop_times_pkey', ['feedIndex', 'stopSequence', 'tripId'], {
  unique: true,
})
@Index('stop_times_key', ['feedIndex', 'stopId', 'tripId'], {})
@Entity('stop_times', { schema: 'gtfs' })
@ObjectType()
export class StopTimes {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'trip_id' })
  @Field({ nullable: true })
  tripId: string;

  @Column('interval', { name: 'arrival_time', nullable: true })
  @Field(() => Int, { nullable: true })
  arrivalTime: any | null;

  @Column('interval', { name: 'departure_time', nullable: true })
  @Field(() => Int, { nullable: true })
  departureTime: any | null;

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
  @Field({ nullable: true })
  shapeDistTraveled: string | null;

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

  @ManyToOne(() => Stops, (stops) => stops.stopTimes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'stop_id', referencedColumnName: 'stopId' },
  ])
  @Field(() => Stops)
  stops: Stops;

  @ManyToOne(() => Trips, (trips) => trips.stopTimes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'trip_id', referencedColumnName: 'tripId' },
  ])
  @Field(() => Trips)
  trips: Trips;

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

  @ManyToOne(() => Timepoints, (timepoints) => timepoints.stopTimes)
  @JoinColumn([{ name: 'timepoint', referencedColumnName: 'timepoint' }])
  @Field(() => Timepoints)
  timepoint: Timepoints;
}
