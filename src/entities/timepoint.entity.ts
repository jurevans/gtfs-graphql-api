import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { StopTime } from 'entities/stop-time.entity';

@Index('timepoints_pkey', ['timepoint'], { unique: true })
@Entity('timepoints', { schema: 'gtfs' })
@ObjectType()
export class Timepoint {
  @Column('integer', { primary: true, name: 'timepoint' })
  @Field(() => Int)
  timepoint: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => StopTime, (stopTime) => stopTime.timepoint)
  @Field(() => [StopTime])
  stopTimes: StopTime[];
}
