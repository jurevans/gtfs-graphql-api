import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { StopTimes } from 'entities/stop-times.entity';

@Index('pickup_dropoff_types_pkey', ['typeId'], { unique: true })
@Entity('pickup_dropoff_types', { schema: 'gtfs' })
@ObjectType()
export class PickupDropoffTypes {
  @Column('integer', { primary: true, name: 'type_id' })
  @Field(() => Int)
  typeId: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.dropOffType)
  @Field(() => [StopTimes])
  stopTimesByDropoffType: StopTimes[];

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.pickupType)
  @Field(() => [StopTimes])
  stopTimesByPickupType: StopTimes[];
}
