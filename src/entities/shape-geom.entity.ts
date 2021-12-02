import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToOne } from 'typeorm';
import { LineString } from 'entities/linestring.entity';
import { Shape } from 'entities/shape.entity';

@Index('shape_geom_pkey', ['feedIndex', 'shapeId'], { unique: true })
@Entity('shape_geoms', { schema: 'gtfs' })
@ObjectType()
export class ShapeGeom {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int, { nullable: true })
  feedIndex: number;

  @Column('text', { primary: true, name: 'shape_id' })
  @Field({ nullable: true })
  shapeId: string;

  @Column('numeric', { name: 'length', precision: 12, scale: 2 })
  @Field(() => Float, { nullable: true })
  length: number;

  @Column('geometry', { name: 'the_geom', nullable: true })
  @Field(() => LineString)
  geom: LineString;

  @OneToOne(() => Shape, (shape) => shape.shapeGeom)
  @Field(() => Shape)
  shape: Shape;
}
