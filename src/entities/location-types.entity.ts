import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Stop } from 'entities/stop.entity';

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

  @OneToMany(() => Stop, (stop) => stop.locationType)
  @Field(() => [Stop])
  stops: Stop[];
}
