import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Calendar } from 'entities/calendar.entity';
import { FareAttributes } from 'entities/fare-attributes.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { Route } from 'entities/route.entity';

@Entity('fare_rules', { schema: 'gtfs' })
@ObjectType()
export class FareRule {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: true })
  id: string;

  @Column('text', { name: 'origin_id', nullable: true })
  @Field({ nullable: true })
  originId: string | null;

  @Column('text', { name: 'destination_id', nullable: true })
  @Field({ nullable: true })
  destinationId: string | null;

  @Column('text', { name: 'contains_id', nullable: true })
  @Field({ nullable: true })
  containsId: string | null;

  @ManyToOne(() => Calendar, (calendar) => calendar.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  @Field(() => Calendar)
  calendar: Calendar;

  @ManyToOne(() => FareAttributes, (fareAttributes) => fareAttributes.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'fare_id', referencedColumnName: 'fareId' },
  ])
  @Field(() => FareAttributes)
  fareAttributes: FareAttributes;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.fareRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(() => Route, (route) => route.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'route_id', referencedColumnName: 'routeId' },
  ])
  @Field(() => Route)
  routes: Route;
}
