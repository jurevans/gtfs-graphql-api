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
import { CalendarDate } from 'entities/calendar-date.entity';
import { FareRule } from 'entities/fare-rule.entity';
import { Transfer } from 'entities/transfer.entity';
import { Trip } from 'entities/trip.entity';

@Index('calendar_pkey', ['feedIndex', 'serviceId'], { unique: true })
@Index('calendar_service_id', ['serviceId'], {})
@Entity('calendar', { schema: 'gtfs' })
@ObjectType()
export class Calendar {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'service_id' })
  @Field()
  serviceId: string;

  @Column('integer', { name: 'monday' })
  @Field(() => Int, { nullable: true })
  monday: number;

  @Column('integer', { name: 'tuesday' })
  @Field(() => Int, { nullable: true })
  tuesday: number;

  @Column('integer', { name: 'wednesday' })
  @Field(() => Int, { nullable: true })
  wednesday: number;

  @Column('integer', { name: 'thursday' })
  @Field(() => Int, { nullable: true })
  thursday: number;

  @Column('integer', { name: 'friday' })
  @Field(() => Int, { nullable: true })
  friday: number;

  @Column('integer', { name: 'saturday' })
  @Field(() => Int, { nullable: true })
  saturday: number;

  @Column('integer', { name: 'sunday' })
  @Field(() => Int, { nullable: true })
  sunday: number;

  @Column('date', { name: 'start_date' })
  @Field({ nullable: true })
  startDate: string;

  @Column('date', { name: 'end_date' })
  @Field({ nullable: true })
  endDate: string;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.calendars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @OneToMany(() => CalendarDate, (calendarDate) => calendarDate.calendar)
  @Field(() => [CalendarDate])
  calendarDates: CalendarDate[];

  @OneToMany(() => FareRule, (fareRule) => fareRule.calendar)
  @Field(() => [FareRule])
  fareRules: FareRule[];

  @OneToMany(() => Transfer, (transfer) => transfer.calendar)
  @Field(() => [Transfer])
  transfers: Transfer[];

  @OneToMany(() => Trip, (trip) => trip.calendar)
  @Field(() => [Trip])
  trips: Trip[];
}
