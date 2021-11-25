import { Args, Query, Resolver } from '@nestjs/graphql';
import { Stop } from 'entities/stop.entity';
import { StopsService } from 'stops/stops.service';
import { GetStopArgs, GetStopsArgs } from 'stops/stops.args';
@Resolver(() => Stop)
export class StopsResolver {
  constructor(private readonly stopsService: StopsService) {}

  @Query(() => [Stop])
  stops(@Args() getStopsArgs: GetStopsArgs): Promise<Stop[]> {
    return this.stopsService.findMany(getStopsArgs);
  }

  @Query(() => Stop)
  stop(@Args() getStopArgs: GetStopArgs) {
    return this.stopsService.find(getStopArgs);
  }
}
