import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Route } from 'entities/route.entity';

@Index('route_types_pkey', ['routeType'], { unique: true })
@Entity('route_types', { schema: 'gtfs' })
@ObjectType()
export class RouteTypes {
  @Column('integer', { primary: true, name: 'route_type' })
  @Field(() => Int)
  routeType: number;

  @Column('text', { name: 'description', nullable: true })
  @Field({ nullable: true })
  description: string | null;

  @OneToMany(() => Route, (route) => route.routeType)
  @Field(() => [Route])
  routes: Route[];
}
