import { ArgsType, Field } from '@nestjs/graphql';
import { FeedArgs } from 'args/feed.args';
import { IsArray, IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetStopsArgs extends FeedArgs {
  @Field({ nullable: true })
  isParent: boolean;

  @Field({ nullable: true })
  isChild: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  stopIds: string[];
}

@ArgsType()
export class GetStopArgs extends FeedArgs {
  @Field()
  @IsNotEmpty()
  stopId: string;
}
