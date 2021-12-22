import { ArgsType, Field, Float, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, Min } from 'class-validator';

@ArgsType()
export class GetStopsArgs {
  @Field(() => Int, { nullable: true })
  feedIndex?: number;

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

  @Field(() => [String], { nullable: true })
  stopIds: string[];
}

@ArgsType()
export class GetStationsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  feedIndex?: number;

  @Field(() => [String], { nullable: true })
  stationIds?: string[];
}
