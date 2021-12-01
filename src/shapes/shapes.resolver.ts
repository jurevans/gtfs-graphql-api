import { Resolver } from '@nestjs/graphql';
import { ShapesService } from './shapes.service';

@Resolver()
export class ShapesResolver {
  constructor(private readonly shapesService: ShapesService) {}
}
