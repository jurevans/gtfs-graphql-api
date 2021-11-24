import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Stops } from 'entities/stops.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Index('location_types_pkey', ['locationType'], { unique: true })
@Entity('location_types', { schema: 'gtfs' })
@ObjectType()
export class LocationTypes {
  @Column('integer', { primary: true, name: 'location_type' })
  @Field(() => Int)
  locationType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Stops, (stops) => stops.locationType)
  @Field(() => [Stops])
  stops: Stops[];
}
