import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agency } from 'entities/agency.entity';
import { Calendar } from 'entities/calendar.entity';
import { FareAttributes } from 'entities/fare-attributes.entity';
import { FareRule } from 'entities/fare-rule.entity';
import { Frequency } from 'entities/frequency.entity';
import { Route } from 'entities/route.entity';
import { StopTime } from 'entities/stop-time.entity';
import { Transfer } from 'entities/transfer.entity';
import { Trip } from 'entities/trip.entity';

@Index('feed_info_pkey', ['feedIndex'], { unique: true })
@Entity('feed_info', { schema: 'gtfs' })
@ObjectType()
export class FeedInfo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { name: 'feed_publisher_name', nullable: true })
  @Field({ nullable: true })
  feedPublisherName: string | null;

  @Column('text', { name: 'feed_publisher_url', nullable: true })
  @Field({ nullable: true })
  feedPublisherUrl: string | null;

  @Column('text', { name: 'feed_timezone', nullable: true })
  @Field({ nullable: true })
  feedTimezone: string | null;

  @Column('text', { name: 'feed_lang', nullable: true })
  @Field({ nullable: true })
  feedLang: string | null;

  @Column('text', { name: 'feed_version', nullable: true })
  @Field({ nullable: true })
  feedVersion: string | null;

  @Column('date', { name: 'feed_start_date', nullable: true })
  @Field({ nullable: true })
  feedStartDate: string | null;

  @Column('date', { name: 'feed_end_date', nullable: true })
  @Field({ nullable: true })
  feedEndDate: string | null;

  @Column('text', { name: 'feed_id', nullable: true })
  @Field({ nullable: true })
  feedId: string | null;

  @Column('text', { name: 'feed_contact_url', nullable: true })
  @Field({ nullable: true })
  feedContactUrl: string | null;

  @Column('text', { name: 'feed_contact_email', nullable: true })
  @Field({ nullable: true })
  feedContactEmail: string | null;

  @Column('date', { name: 'feed_download_date', nullable: true })
  @Field({ nullable: true })
  feedDownloadDate: string | null;

  @Column('text', { name: 'feed_file', nullable: true })
  @Field({ nullable: true })
  feedFile: string | null;

  @OneToMany(() => Agency, (agency) => agency.feed)
  @Field(() => [Agency], { nullable: true })
  agencies: Agency[];

  @OneToMany(() => Calendar, (calendar) => calendar.feedIndex)
  @Field(() => [Calendar])
  calendars: Calendar[];

  @OneToMany(() => FareAttributes, (fareAttributes) => fareAttributes.feed)
  @Field(() => [FareAttributes])
  fareAttributes: FareAttributes[];

  @OneToMany(() => FareRule, (fareRule) => fareRule.feed)
  @Field(() => [FareRule])
  fareRules: FareRule[];

  @OneToMany(() => Frequency, (frequency) => frequency.feed)
  @Field(() => [Frequency])
  frequencies: Frequency[];

  @OneToMany(() => Route, (route) => route.feed)
  @Field(() => [Route])
  routes: Route[];

  @OneToMany(() => StopTime, (stopTime) => stopTime.feedIndex)
  @Field(() => [StopTime])
  stopTimes: StopTime[];

  @OneToMany(() => Transfer, (transfer) => transfer.feedIndex)
  @Field(() => [Transfer])
  transfers: Transfer[];

  @OneToMany(() => Trip, (trip) => trip.feedIndex)
  @Field(() => [Trip])
  trips: Trip[];
}
