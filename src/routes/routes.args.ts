import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';

@ArgsType()
export class GetRoutesArgs extends FeedArgs {}

@ArgsType()
export class GetRouteArgs extends FeedArgs {
  @Field()
  routeId: string;
}
