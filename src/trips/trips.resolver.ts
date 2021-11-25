import { Resolver } from '@nestjs/graphql';
import { TripsService } from './trips.service';

@Resolver()
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}
}
