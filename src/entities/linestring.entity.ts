import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ICoordinate, ILineString } from 'interfaces/geojson.interface';

@ObjectType()
export class LineString implements ILineString {
  @Field()
  type: 'LineString';

  @Field(() => [[Float]])
  coordinates: ICoordinate[][];
}
