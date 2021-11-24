import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';

@Index('shape_geom_pkey', ['feedIndex', 'shapeId'], { unique: true })
@Entity('shape_geoms', { schema: 'gtfs' })
@ObjectType()
export class ShapeGeom {
  @Column('integer', { primary: true, name: 'feed_index' })
  @Field(() => Int)
  feedIndex: number;

  @Column('text', { primary: true, name: 'shape_id' })
  @Field()
  shapeId: string;

  @Column('numeric', { name: 'length', precision: 12, scale: 2 })
  @Field({ nullable: true })
  length: string;

  @Column('geometry', { name: 'the_geom', nullable: true })
  @Field()
  theGeom: string | null;
}
