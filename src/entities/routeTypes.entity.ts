import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Routes } from 'entities/routes.entity';

@Index('route_types_pkey', ['routeType'], { unique: true })
@Entity('route_types', { schema: 'gtfs' })
export class RouteTypes {
  @Column('integer', { primary: true, name: 'route_type' })
  routeType: number;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @OneToMany(() => Routes, (routes) => routes.routeType)
  routes: Routes[];
}
