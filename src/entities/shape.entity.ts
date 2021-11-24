import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index(
  'shapes_pkey',
  ['shapeId', 'shapePtLon', 'shapePtLat', 'shapePtSequence'],
  { unique: true },
)
@Entity('shapes', { schema: 'gtfs' })
@ObjectType()
export class Shape {
  @Column('integer', { name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @PrimaryColumn('text', { name: 'shape_id' })
  @Field()
  shapeId: string;

  @PrimaryColumn('double precision', { name: 'shape_pt_lat', precision: 53 })
  @Field(() => Int)
  shapePtLat: number;

  @PrimaryColumn('double precision', { name: 'shape_pt_lon', precision: 53 })
  @Field(() => Int)
  shapePtLon: number;

  @Column('integer', { name: 'shape_pt_sequence' })
  @Field(() => Int)
  shapePtSequence: number;

  @Column('double precision', {
    name: 'shape_dist_traveled',
    nullable: true,
    precision: 53,
  })
  @Field(() => Int, { nullable: true })
  shapeDistTraveled: number | null;
}
