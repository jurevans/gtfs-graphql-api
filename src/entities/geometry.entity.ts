import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IGeometry, ICoordinate } from 'interfaces/geojson.interface';

@ObjectType()
export class Geometry implements IGeometry {
  @Field()
  type: 'LineString' | 'Point' | 'Polygon';

  @Field(() => [Float])
  coordinates: ICoordinate[];
}
