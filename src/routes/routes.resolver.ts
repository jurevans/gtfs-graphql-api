import { Args, Query, Resolver } from '@nestjs/graphql';
import { Route } from 'entities/route.entity';
import { RoutesService } from 'routes/routes.service';
import { GetRouteArgs, GetRoutesArgs } from 'routes/route.args';
@Resolver(() => Route)
export class RoutesResolver {
  constructor(private readonly routesService: RoutesService) {}

  @Query(() => [Route])
  routes(@Args() getRoutesArgs: GetRoutesArgs): Promise<Route[]> {
    return this.routesService.findAll(getRoutesArgs);
  }

  @Query(() => Route)
  route(@Args() getRouteArgs: GetRouteArgs) {
    return this.routesService.find(getRouteArgs);
  }
}
