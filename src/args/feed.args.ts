import { ArgsType, Int, Field } from '@nestjs/graphql';

@ArgsType()
export class FeedArgs {
  @Field(() => Int)
  feedIndex: number;
}
