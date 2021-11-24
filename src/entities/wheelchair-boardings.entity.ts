import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Stop } from 'entities/stop.entity';

@Index('wheelchair_boardings_pkey', ['wheelchairBoarding'], { unique: true })
@Entity('wheelchair_boardings', { schema: 'gtfs' })
@ObjectType()
export class WheelchairBoardings {
  @Column('integer', { primary: true, name: 'wheelchair_boarding' })
  @Field(() => Int)
  wheelchairBoarding: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Stop, (stop) => stop.wheelchairBoarding)
  @Field(() => [Stop])
  stops: Stop[];
}
