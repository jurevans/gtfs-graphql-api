import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Max, Min } from 'class-validator';

@ArgsType()
export class GetTripsArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;

  @Field({ nullable: true })
  routeId: string;

  @Field({ nullable: true })
  serviceId: string;
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
export class GetNextTripArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  feedIndex: number;

  @Field()
  @IsNotEmpty()
  routeId: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Max(1)
  directionId: number;
}
