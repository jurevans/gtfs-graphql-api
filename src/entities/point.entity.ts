import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IPoint, ICoordinate } from 'interfaces/geojson.interface';

@ObjectType()
export class Point implements IPoint {
  @Field()
  type: 'Point';

  @Field(() => [Float])
  coordinates: ICoordinate[];
}
