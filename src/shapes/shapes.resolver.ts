import { Args, Query, Resolver } from '@nestjs/graphql';
import { ShapeGeom } from 'entities/shape-geom.entity';
import { ShapesService } from 'shapes/shapes.service';
import { GetShapeArgs, GetShapesArgs } from './shapes.args';

@Resolver(() => ShapeGeom)
export class ShapesResolver {
  constructor(private readonly shapesService: ShapesService) {}

  @Query(() => [ShapeGeom], { name: 'shapes' })
  getShapes(@Args() getShapesArgs: GetShapesArgs): Promise<ShapeGeom[]> {
    return this.shapesService.getShapes(getShapesArgs);
  }

  @Query(() => ShapeGeom, { name: 'shape' })
  getShape(@Args() getShapeArgs: GetShapeArgs): Promise<ShapeGeom> {
    return this.shapesService.getShape(getShapeArgs);
  }
}
