import { Args, Query, Resolver } from '@nestjs/graphql';
import { Stop } from 'entities/stop.entity';
import { StopsService } from 'stops/stops.service';
import { GetStopArgs, GetStopsArgs, GetTransfersArgs } from 'stops/stops.args';

@Resolver(() => Stop)
export class StopsResolver {
  constructor(private readonly stopsService: StopsService) {}

  @Query(() => [Stop], { name: 'stops' })
  getStops(@Args() getStopsArgs: GetStopsArgs): Promise<Stop[]> {
    return this.stopsService.getStops(getStopsArgs);
  }

  @Query(() => Stop, { name: 'stop' })
  getStop(@Args() getStopArgs: GetStopArgs): Promise<Stop> {
    return this.stopsService.getStop(getStopArgs);
  }

  @Query(() => [Stop], { name: 'transfers' })
  getTransfers(@Args() getStopArgs: GetTransfersArgs): Promise<Stop[]> {
    return this.stopsService.getTransfers(getStopArgs);
  }
}
