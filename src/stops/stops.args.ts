import { ArgsType, Field, Float, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, Min } from 'class-validator';

@ArgsType()
export class GetStopsArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;

  @Field({ nullable: true })
  isParent: boolean;

  @Field({ nullable: true })
  isChild: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  stopIds: string[];
}

@ArgsType()
export class GetStopArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;

  @Field()
  @IsNotEmpty()
  stopId: string;
}

@ArgsType()
export class GetStopsByLocationArgs {
  @Field(() => [Float])
  location: [number, number];

  @Field(() => Float)
  radius: number;
}

@ArgsType()
export class GetTransfersArgs {
  @Field(() => Int)
  @Min(1)
  feedIndex: number;

  @Field(() => String)
  parentStation: string;
}
