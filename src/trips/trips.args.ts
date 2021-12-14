import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';

@ArgsType()
export class GetTripsArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;

  @Field({ nullable: true })
  routeId?: string;

  @Field(() => [String])
  @IsNotEmpty()
  tripIds: string[];
}

@ArgsType()
export class GetTripArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  feedIndex: number;

  @Field()
  @IsNotEmpty()
  tripId: string;
}

@ArgsType()
export class GetNextTripsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  feedIndex: number;

  @Field()
  @IsNotEmpty()
  routeId: string;
}
