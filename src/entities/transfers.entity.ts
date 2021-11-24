import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Calendar } from 'entities/calendar.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { Routes } from 'entities/routes.entity';
import { TransferTypes } from 'entities/transfer-types.entity';

@Index('transfers_pkey', ['feedIndex', 'fromStopId', 'toStopId'], {
  unique: true,
})
@Entity('transfers', { schema: 'gtfs' })
export class Transfers {
  @PrimaryColumn('number', { name: 'feed_index' })
  feedIndex: FeedInfo;

  @PrimaryColumn('text', { name: 'from_stop_id' })
  fromStopId: string;

  @PrimaryColumn('text', { name: 'to_stop_id' })
  toStopId: string;

  @Column('integer', { name: 'min_transfer_time', nullable: true })
  minTransferTime: number | null;

  @ManyToOne(() => Calendar, (calendar) => calendar.transfers)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'service_id', referencedColumnName: 'serviceId' },
  ])
  calendar: Calendar;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.transfers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  feed: FeedInfo;

  @ManyToOne(() => Routes, (routes) => routes.transfers)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'from_route_id', referencedColumnName: 'routeId' },
  ])
  route: Routes;

  @ManyToOne(() => TransferTypes, (transferTypes) => transferTypes.transfers)
  @JoinColumn([{ name: 'transfer_type', referencedColumnName: 'transferType' }])
  transferType: TransferTypes;
}
