import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FeedInfo } from 'entities/feed-info.entity';
import { FareAttributes } from 'entities/fare-attributes.entity';
import { Route } from 'entities/route.entity';

@Index('agency_pkey', ['agencyId', 'feedIndex'], { unique: true })
@Entity('agency', { schema: 'gtfs' })
@ObjectType()
export class Agency {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int, { nullable: true })
  feedIndex: number;

  @Column('text', { primary: true, name: 'agency_id', default: () => '""' })
  @Field()
  agencyId: string;

  @Column('text', { name: 'agency_name', nullable: true })
  @Field({ nullable: true })
  agencyName: string | null;

  @Column('text', { name: 'agency_url', nullable: true })
  @Field({ nullable: true })
  agencyUrl: string | null;

  @Column('text', { name: 'agency_timezone', nullable: true })
  @Field({ nullable: true })
  agencyTimezone: string | null;

  @Column('text', { name: 'agency_lang', nullable: true })
  @Field({ nullable: true })
  agencyLang: string | null;

  @Column('text', { name: 'agency_phone', nullable: true })
  @Field({ nullable: true })
  agencyPhone: string | null;

  @Column('text', { name: 'agency_fare_url', nullable: true })
  @Field({ nullable: true })
  agencyFareUrl: string | null;

  @Column('text', { name: 'agency_email', nullable: true })
  @Field({ nullable: true })
  agencyEmail: string | null;

  @Column('text', { name: 'bikes_policy_url', nullable: true })
  @Field({ nullable: true })
  bikesPolicyUrl: string | null;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.agencies)
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @OneToMany(() => FareAttributes, (fareAttributes) => fareAttributes.agency)
  fareAttributes: FareAttributes[];

  @OneToMany(() => Route, (route) => route.agency)
  routes: Route[];
}
