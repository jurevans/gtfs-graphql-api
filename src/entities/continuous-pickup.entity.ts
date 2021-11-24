import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { StopTime } from 'entities/stop-time.entity';

@Index('continuous_pickup_pkey', ['continuousPickup'], { unique: true })
@Entity('continuous_pickup', { schema: 'gtfs' })
@ObjectType()
export class ContinuousPickup {
  @Column('integer', { primary: true, name: 'continuous_pickup' })
  @Field(() => Int)
  continuousPickup: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => StopTime, (stopTime) => stopTime.continuousPickup)
  @Field(() => [StopTime])
  stopTimes: StopTime[];
}
