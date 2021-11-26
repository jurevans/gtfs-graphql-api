import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetRoutesArgs extends FeedArgs {}

@ArgsType()
export class GetRouteArgs extends FeedArgs {
  @Field()
  @IsNotEmpty()
  routeId: string;
}
