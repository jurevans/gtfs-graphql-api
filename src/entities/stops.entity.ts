import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StopTimes } from './stop-times.entity';
import { LocationTypes } from './location-types.entity';
import { WheelchairAccessible } from './wheelchair-accessible.entity';
import { WheelchairBoardings } from './wheelchair-boardings.entity';
import { Transfers } from './transfers.entity';

@Index('stops_pkey', ['feedIndex', 'stopId'], { unique: true })
@Entity('stops', { schema: 'gtfs' })
export class Stops {
  @Column('integer', { primary: true, name: 'feed_index' })
  feedIndex: number;

  @Column('text', { primary: true, name: 'stop_id' })
  stopId: string;

  @Column('text', { name: 'stop_name', nullable: true })
  stopName: string | null;

  @Column('text', { name: 'stop_desc', nullable: true })
  stopDesc: string | null;

  @Column('double precision', {
    name: 'stop_lat',
    nullable: true,
    precision: 53,
  })
  stopLat: number | null;

  @Column('double precision', {
    name: 'stop_lon',
    nullable: true,
    precision: 53,
  })
  stopLon: number | null;

  @Column('text', { name: 'zone_id', nullable: true })
  zoneId: string | null;

  @Column('text', { name: 'stop_url', nullable: true })
  stopUrl: string | null;

  @Column('text', { name: 'stop_code', nullable: true })
  stopCode: string | null;

  @Column('text', { name: 'stop_street', nullable: true })
  stopStreet: string | null;

  @Column('text', { name: 'stop_city', nullable: true })
  stopCity: string | null;

  @Column('text', { name: 'stop_region', nullable: true })
  stopRegion: string | null;

  @Column('text', { name: 'stop_postcode', nullable: true })
  stopPostcode: string | null;

  @Column('text', { name: 'stop_country', nullable: true })
  stopCountry: string | null;

  @Column('text', { name: 'stop_timezone', nullable: true })
  stopTimezone: string | null;

  @Column('text', { name: 'direction', nullable: true })
  direction: string | null;

  @Column('text', { name: 'position', nullable: true })
  position: string | null;

  @Column('text', { name: 'parent_station', nullable: true })
  parentStation: string | null;

  @Column('integer', { name: 'vehicle_type', nullable: true })
  vehicleType: number | null;

  @Column('text', { name: 'platform_code', nullable: true })
  platformCode: string | null;

  @Column('geometry', { name: 'the_geom', nullable: true })
  theGeom: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.stops)
  stopTimes: StopTimes[];

  @ManyToOne(() => LocationTypes, (locationTypes) => locationTypes.stops)
  @JoinColumn([{ name: 'location_type', referencedColumnName: 'locationType' }])
  locationType: LocationTypes;

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
  wheelchairAccessible: WheelchairAccessible;

  @ManyToOne(
    () => WheelchairBoardings,
    (wheelchairBoardings) => wheelchairBoardings.stops,
  )
  @JoinColumn([
    { name: 'wheelchair_boarding', referencedColumnName: 'wheelchairBoarding' },
  ])
  wheelchairBoarding: WheelchairBoardings;

  @OneToMany(() => Transfers, (transfers) => transfers.fromStopId)
  transfersFrom: Transfers[];

  @OneToMany(() => Transfers, (transfers) => transfers.toStopId)
  transfersTo: Transfers[];
}
