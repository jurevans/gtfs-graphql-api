import { Args, Query, Resolver } from '@nestjs/graphql';
import { Trip } from 'entities/trip.entity';
import { GetNextTripsArgs, GetTripArgs, GetTripsArgs } from './trips.args';
import { TripsService } from './trips.service';

@Resolver()
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}

  @Query(() => [Trip], { name: 'trips' })
  getTrips(@Args() getTripsArgs: GetTripsArgs): Promise<Trip[]> {
    return this.tripsService.getTrips(getTripsArgs);
  }

  @Query(() => Trip, { name: 'trip' })
  getTrip(@Args() getTripArgs: GetTripArgs): Promise<Trip> {
    return this.tripsService.getTrip(getTripArgs);
  }

  @Query(() => [Trip], { name: 'nextTrips' })
  getNextTrips(@Args() getNextTripsArgs: GetNextTripsArgs): Promise<Trip[]> {
    return this.tripsService.getNextTrips(getNextTripsArgs);
  }
}
