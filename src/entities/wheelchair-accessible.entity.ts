import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Stops } from 'entities/stops.entity';
import { Trips } from 'entities/trips.entity';

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

  @OneToMany(() => Stops, (stops) => stops.wheelchairAccessible)
  @Field(() => [Stops])
  stops: Stops[];

  @OneToMany(() => Trips, (trips) => trips.wheelchairAccessible)
  @Field(() => [Trips])
  trips: Trips[];
}
