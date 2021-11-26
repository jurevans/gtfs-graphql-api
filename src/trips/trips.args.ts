import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetTripsArgs extends FeedArgs {
  @Field({ nullable: true })
  routeId: string;
}

@ArgsType()
export class GetTripArgs extends FeedArgs {
  @Field()
  @IsNotEmpty()
  tripId: string;
}
