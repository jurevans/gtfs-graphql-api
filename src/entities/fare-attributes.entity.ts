import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Agency } from 'entities/agency.entity';
import { FeedInfo } from 'entities/feed-info.entity';
import { PaymentMethod } from 'entities/payment-method.entity';
import { FareRule } from 'entities/fare-rule.entity';

@Index('fare_attributes_pkey', ['fareId', 'feedIndex'], { unique: true })
@Entity('fare_attributes', { schema: 'gtfs' })
@ObjectType()
export class FareAttributes {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'fare_id' })
  @Field()
  fareId: string;

  @Column('double precision', { name: 'price', precision: 53 })
  @Field(() => Int)
  price: number;

  @Column('text', { name: 'currency_type' })
  @Field()
  currencyType: string;

  @Column('integer', { name: 'transfers', nullable: true })
  @Field(() => Int, { nullable: true })
  transfers: number | null;

  @Column('integer', { name: 'transfer_duration', nullable: true })
  @Field(() => Int, { nullable: true })
  transferDuration: number | null;

  @ManyToOne(() => Agency, (agency) => agency.fareAttributes)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'agency_id', referencedColumnName: 'agencyId' },
  ])
  @Field(() => Agency)
  agency: Agency;

  @ManyToOne(() => FeedInfo, (feedInfo) => feedInfo.fareAttributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_index', referencedColumnName: 'feedIndex' }])
  @Field(() => FeedInfo)
  feed: FeedInfo;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.fareAttributes,
  )
  @JoinColumn([
    { name: 'payment_method', referencedColumnName: 'paymentMethod' },
  ])
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @OneToMany(() => FareRule, (fareRule) => fareRule.fareAttributes)
  @Field(() => [FareRule])
  fareRules: FareRule[];
}
