import { ArgsType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class FeedArgs {
  @Field(() => Int)
  @IsInt()
  feedIndex: number;
}
