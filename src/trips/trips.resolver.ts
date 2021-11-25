import { Args, Query, Resolver } from '@nestjs/graphql';
import { Trip } from 'entities/trip.entity';
import { GetTripArgs, GetTripsArgs } from './trips.args';
import { TripsService } from './trips.service';

@Resolver()
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}

  @Query(() => [Trip])
  trips(@Args() getTripsArgs: GetTripsArgs): Promise<Trip[]> {
    return this.tripsService.findAll(getTripsArgs);
  }

  @Query(() => Trip)
  trip(@Args() getTripArgs: GetTripArgs) {
    return this.tripsService.find(getTripArgs);
  }
}
