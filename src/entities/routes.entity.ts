import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FareRules } from './fare-rules.entity';
import { Agency } from './agency.entity';
import { FeedInfo } from './feed-info.entity';
import { RouteTypes } from './routeTypes.entity';
import { Transfers } from './transfers.entity';
import { Trips } from './trips.entity';

@Index('routes_pkey', ['feedIndex', 'routeId'], { unique: true })
@Entity('routes', { schema: 'gtfs' })
@ObjectType()
export class Routes {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'route_id' })
  @Field()
  routeId: string;

  @Column('text', {
    name: 'route_short_name',
    nullable: true,
    default: () => '""',
  })
  @Field({ nullable: true })
  routeShortName: string | null;

  @Column('text', {
    name: 'route_long_name',
    nullable: true,
    default: () => '""',
  })
  @Field({ nullable: true })
  routeLongName: string | null;

  @Column('text', { name: 'route_desc', nullable: true, default: () => '""' })
  @Field({ nullable: true })
  routeDesc: string | null;

  @Column('text', { name: 'route_url', nullable: true })
  @Field({ nullable: true })
  routeUrl: string | null;

  @Column('text', { name: 'route_color', nullable: true })
  @Field({ nullable: true })
  routeColor: string | null;

  @Column('text', { name: 'route_text_color', nullable: true })
  @Field({ nullable: true })
  routeTextColor: string | null;

  @Column('integer', { name: 'route_sort_order', nullable: true })
  @Field({ nullable: true })
  routeSortOrder: number | null;

  @OneToMany(() => FareRules, (fareRules) => fareRules.routes)
  fareRules: FareRules[];

  @ManyToOne(() => Agency, (agency) => agency.routes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'agency_id', referencedColumnName: 'agencyId' },
  ])
  @Field(() => Agency)
  agency: Agency;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.routes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  feed: FeedInfo;

  @ManyToOne(() => RouteTypes, (routeTypes) => routeTypes.routes)
  @JoinColumn([{ name: 'route_type', referencedColumnName: 'routeType' }])
  routeType: RouteTypes;

  @ManyToOne(() => RouteTypes, (routeTypes) => routeTypes.routes2)
  @JoinColumn([{ name: 'route_type', referencedColumnName: 'routeType' }])
  routeType2: RouteTypes;

  @OneToMany(() => Transfers, (transfers) => transfers.routes)
  transfers: Transfers[];

  @OneToMany(() => Transfers, (transfers) => transfers.routes2)
  transfers2: Transfers[];

  @OneToMany(() => Trips, (trips) => trips.routes)
  trips: Trips[];
}
