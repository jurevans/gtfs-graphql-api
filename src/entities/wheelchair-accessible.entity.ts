import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Stop } from 'entities/stop.entity';
import { Trip } from 'entities/trip.entity';

@Index('wheelchair_accessible_pkey', ['wheelchairAccessible'], { unique: true })
@Entity('wheelchair_accessible', { schema: 'gtfs' })
@ObjectType()
export class WheelchairAccessible {
  @Column('integer', { primary: true, name: 'wheelchair_accessible' })
  @Field(() => Int)
  wheelchairAccessible: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Stop, (stop) => stop.wheelchairAccessible)
  @Field(() => [Stop])
  stops: Stop[];

  @OneToMany(() => Trip, (trip) => trip.wheelchairAccessible)
  @Field(() => [Trip])
  trips: Trip[];
}
