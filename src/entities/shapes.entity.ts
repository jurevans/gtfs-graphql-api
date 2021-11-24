import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index(
  'shapes_pkey',
  ['shapeId', 'shapePtLon', 'shapePtLat', 'shapePtSequence'],
  { unique: true },
)
@Entity('shapes', { schema: 'gtfs' })
export class Shapes {
  @Column('integer', { name: 'feed_index' })
  feedIndex: number;

  @PrimaryColumn('text', { name: 'shape_id' })
  shapeId: string;

  @PrimaryColumn('double precision', { name: 'shape_pt_lat', precision: 53 })
  shapePtLat: number;

  @PrimaryColumn('double precision', { name: 'shape_pt_lon', precision: 53 })
  shapePtLon: number;

  @Column('integer', { name: 'shape_pt_sequence' })
  shapePtSequence: number;

  @Column('double precision', {
    name: 'shape_dist_traveled',
    nullable: true,
    precision: 53,
  })
  shapeDistTraveled: number | null;
}
