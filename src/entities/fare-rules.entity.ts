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
import { Routes } from 'entities/routes.entity';

@Entity('fare_rules', { schema: 'gtfs' })
export class FareRules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'origin_id', nullable: true })
  originId: string | null;

  @Column('text', { name: 'destination_id', nullable: true })
  destinationId: string | null;

  @Column('text', { name: 'contains_id', nullable: true })
  containsId: string | null;

  @ManyToOne(() => Calendar, (calendar) => calendar.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  calendar: Calendar;

  @ManyToOne(() => FareAttributes, (fareAttributes) => fareAttributes.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'fare_id', referencedColumnName: 'fareId' },
  ])
  fareAttributes: FareAttributes;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.fareRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  feedIndex: FeedInfo;

  @ManyToOne(() => Routes, (routes) => routes.fareRules)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'route_id', referencedColumnName: 'routeId' },
  ])
  routes: Routes;
}
