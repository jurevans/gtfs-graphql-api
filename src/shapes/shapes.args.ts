import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetShapesArgs {
  @Field(() => [String])
  @IsNotEmpty()
  shapeIds: string[];
}

@ArgsType()
export class GetShapeArgs {
  @Field()
  @IsNotEmpty()
  shapeId: string;
}
