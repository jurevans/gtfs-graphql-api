import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';

@ArgsType()
export class GetTripsArgs extends FeedArgs {
  @Field({ nullable: true })
  routeId: string;
}

@ArgsType()
export class GetTripArgs extends FeedArgs {
  @Field()
  tripId: string;
}
