import { Resolver } from '@nestjs/graphql';
import { StopsService } from './stops.service';

@Resolver()
export class StopsResolver {
  constructor(private readonly stopsService: StopsService) {}
}
