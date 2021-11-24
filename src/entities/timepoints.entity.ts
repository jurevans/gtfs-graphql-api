import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { StopTimes } from 'entities/stop-times.entity';

@Index('timepoints_pkey', ['timepoint'], { unique: true })
@Entity('timepoints', { schema: 'gtfs' })
@ObjectType()
export class Timepoints {
  @Column('integer', { primary: true, name: 'timepoint' })
  @Field(() => Int)
  timepoint: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => StopTimes, (stopTimes) => stopTimes.timepoint)
  @Field(() => [StopTimes])
  stopTimes: StopTimes[];
}
