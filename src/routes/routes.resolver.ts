import { Args, Query, Resolver } from '@nestjs/graphql';
import { Route } from 'entities/route.entity';
import { RoutesService } from 'routes/routes.service';
import { GetRouteArgs, GetRoutesArgs } from 'routes/routes.args';

@Resolver(() => Route)
export class RoutesResolver {
  constructor(private readonly routesService: RoutesService) {}

  @Query(() => [Route], { name: 'routes' })
  getRoutes(@Args() getRoutesArgs: GetRoutesArgs): Promise<Route[]> {
    return this.routesService.getRoutes(getRoutesArgs);
  }

  @Query(() => Route, { name: 'route' })
  getRoute(@Args() getRouteArgs: GetRouteArgs): Promise<Route> {
    return this.routesService.getRoute(getRouteArgs);
  }
}
