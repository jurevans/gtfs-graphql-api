import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ShapeGeom } from './shape-geom.entity';

@Index(
  'shapes_pkey',
  ['shapeId', 'shapePtLon', 'shapePtLat', 'shapePtSequence'],
  { unique: true },
)
@Entity('shapes', { schema: 'gtfs' })
@ObjectType()
export class Shape {
  @Column('integer', { name: 'feed_index' })
  @Field(() => Int, { nullable: true })
  feedIndex: number;

  @PrimaryColumn('text', { name: 'shape_id' })
  @Field({ nullable: true })
  shapeId: string;

  @PrimaryColumn('double precision', { name: 'shape_pt_lat', precision: 53 })
  @Field(() => Float, { nullable: true })
  shapePtLat: number;

  @PrimaryColumn('double precision', { name: 'shape_pt_lon', precision: 53 })
  @Field(() => Float, { nullable: true })
  shapePtLon: number;

  @Column('integer', { name: 'shape_pt_sequence' })
  @Field(() => Int, { nullable: true })
  shapePtSequence: number;

  @Column('double precision', {
    name: 'shape_dist_traveled',
    nullable: true,
    precision: 53,
  })
  @Field(() => Float, { nullable: true })
  shapeDistTraveled: number | null;

  @OneToOne(() => ShapeGeom, (shapeGeom) => shapeGeom.shape)
  @JoinColumn([
    { name: 'feed_index', referencedColumnName: 'feedIndex' },
    { name: 'shape_id', referencedColumnName: 'shapeId' },
  ])
  @Field(() => ShapeGeom)
  shapeGeom: ShapeGeom;
}
