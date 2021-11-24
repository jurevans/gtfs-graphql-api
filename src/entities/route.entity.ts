import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FareRules } from 'entities/fare-rules.entity';
import { Agency } from 'entities/agency.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { RouteTypes } from 'entities/routeTypes.entity';
import { Transfers } from 'entities/transfers.entity';
import { Trip } from 'entities/trip.entity';

@Index('routes_pkey', ['feedIndex', 'routeId'], { unique: true })
@Entity('routes', { schema: 'gtfs' })
@ObjectType()
export class Route {
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
  @Field(() => [FareRules])
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
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(() => RouteTypes, (routeTypes) => routeTypes.routes)
  @JoinColumn([{ name: 'route_type', referencedColumnName: 'routeType' }])
  @Field(() => RouteTypes)
  routeType: RouteTypes;

  @OneToMany(() => Transfers, (transfers) => transfers.route)
  @Field(() => [Transfers])
  transfers: Transfers[];

  @OneToMany(() => Trip, (trips) => trips.route)
  @Field(() => [Trip])
  trips: Trip[];
}
