import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Interval {
  @Field(() => Int, { nullable: true })
  hours: number;

  @Field(() => Int, { nullable: true })
  minutes: number;

  @Field(() => Int, { nullable: true })
  seconds: number;
}
