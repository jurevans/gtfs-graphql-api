import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@ArgsType()
export class GetRoutesArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;
}

@ArgsType()
export class GetRouteArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  feedIndex: number;

  @Field()
  @IsNotEmpty()
  routeId: string;
}
