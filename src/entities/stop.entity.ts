import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StopTime } from 'entities/stop-time.entity';
import { LocationType } from 'entities/location-type.entity';
import { WheelchairAccessible } from 'entities/wheelchair-accessible.entity';
import { WheelchairBoarding } from 'entities/wheelchair-boarding.entity';
import { Transfer } from 'entities/transfer.entity';
import { Point } from 'entities/point.entity';

@Index('stops_pkey', ['feedIndex', 'stopId'], { unique: true })
@Entity('stops', { schema: 'gtfs' })
@ObjectType()
export class Stop {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'stop_id' })
  @Field()
  stopId: string;

  @Column('text', { name: 'stop_name', nullable: true })
  @Field({ nullable: true })
  stopName: string | null;

  @Column('text', { name: 'stop_desc', nullable: true })
  @Field({ nullable: true })
  stopDesc: string | null;

  @Column('double precision', {
    name: 'stop_lat',
    nullable: true,
    precision: 53,
  })
  @Field(() => Float, { nullable: true })
  stopLat: number | null;

  @Column('double precision', {
    name: 'stop_lon',
    nullable: true,
    precision: 53,
  })
  @Field(() => Float, { nullable: true })
  stopLon: number | null;

  @Column('text', { name: 'zone_id', nullable: true })
  @Field({ nullable: true })
  zoneId: string | null;

  @Column('text', { name: 'stop_url', nullable: true })
  @Field({ nullable: true })
  stopUrl: string | null;

  @Column('text', { name: 'stop_code', nullable: true })
  @Field({ nullable: true })
  stopCode: string | null;

  @Column('text', { name: 'stop_street', nullable: true })
  @Field({ nullable: true })
  stopStreet: string | null;

  @Column('text', { name: 'stop_city', nullable: true })
  @Field({ nullable: true })
  stopCity: string | null;

  @Column('text', { name: 'stop_region', nullable: true })
  @Field({ nullable: true })
  stopRegion: string | null;

  @Column('text', { name: 'stop_postcode', nullable: true })
  @Field({ nullable: true })
  stopPostcode: string | null;

  @Column('text', { name: 'stop_country', nullable: true })
  @Field({ nullable: true })
  stopCountry: string | null;

  @Column('text', { name: 'stop_timezone', nullable: true })
  @Field({ nullable: true })
  stopTimezone: string | null;

  @Column('text', { name: 'direction', nullable: true })
  @Field({ nullable: true })
  direction: string | null;

  @Column('text', { name: 'position', nullable: true })
  @Field({ nullable: true })
  position: string | null;

  @Column('text', { name: 'parent_station', nullable: true })
  @Field({ nullable: true })
  parentStation: string | null;

  @Column('integer', { name: 'vehicle_type', nullable: true })
  @Field(() => Int, { nullable: true })
  vehicleType: number | null;

  @Column('text', { name: 'platform_code', nullable: true })
  @Field({ nullable: true })
  platformCode: string | null;

  @Column('geometry', { name: 'the_geom', nullable: true })
  @Field(() => Point, { nullable: true })
  geom: string | null;

  @OneToMany(() => StopTime, (stopTime) => stopTime.stop)
  @Field(() => [StopTime])
  stopTimes: StopTime[];

  @ManyToOne(() => LocationType, (locationType) => locationType.stops)
  @JoinColumn([{ name: 'location_type', referencedColumnName: 'locationType' }])
  @Field(() => LocationType)
  locationType: LocationType;

  @ManyToOne(
    () => WheelchairAccessible,
    (wheelchairAccessible) => wheelchairAccessible.stops,
  )
  @JoinColumn([
    {
      name: 'wheelchair_accessible',
      referencedColumnName: 'wheelchairAccessible',
    },
  ])
  @Field(() => WheelchairAccessible)
  wheelchairAccessible: WheelchairAccessible;

  @ManyToOne(
    () => WheelchairBoarding,
    (wheelchairBoardings) => wheelchairBoardings.stops,
  )
  @JoinColumn([
    { name: 'wheelchair_boarding', referencedColumnName: 'wheelchairBoarding' },
  ])
  @Field(() => WheelchairBoarding)
  wheelchairBoarding: WheelchairBoarding;

  @OneToMany(() => Transfer, (transfer) => transfer.transfersFrom)
  @Field(() => [Transfer])
  transfers: Transfer[];
}
