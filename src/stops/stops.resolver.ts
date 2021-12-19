import { Args, Query, Resolver } from '@nestjs/graphql';
import { Stop } from 'entities/stop.entity';
import { StopsService } from 'stops/stops.service';
import {
  GetStationsArgs,
  GetStopArgs,
  GetStopsArgs,
  GetStopsByLocationArgs,
  GetTransfersArgs,
} from 'stops/stops.args';

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

  @Query(() => [Stop], { name: 'stopsByLocation' })
  getStopsByLocation(
    @Args() getStopsByLocationArgs: GetStopsByLocationArgs,
  ): Promise<Stop[]> {
    return this.stopsService.getStopsByLocation(getStopsByLocationArgs);
  }

  @Query(() => [Stop], { name: 'transfers' })
  getTransfers(@Args() getStopArgs: GetTransfersArgs): Promise<Stop[]> {
    return this.stopsService.getTransfers(getStopArgs);
  }

  @Query(() => [Stop], { name: 'stations' })
  getStations(@Args() getStationsArgs: GetStationsArgs): Promise<Stop[]> {
    return this.stopsService.getStations(getStationsArgs);
  }
}
