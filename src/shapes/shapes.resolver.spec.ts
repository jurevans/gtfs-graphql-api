import { Test, TestingModule } from '@nestjs/testing';
import { ShapesResolver } from 'shapes/shapes.resolver';
import { ShapesService } from 'shapes/shapes.service';

describe('ShapesResolver', () => {
  let resolver: ShapesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShapesResolver, ShapesService],
    }).compile();

    resolver = module.get<ShapesResolver>(ShapesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
