import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ShapesService } from 'shapes/shapes.service';
import { ShapesResolver } from 'shapes/shapes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShapeGeom } from 'entities/shape-geom.entity';
import { CacheTtlSeconds } from 'constants/';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShapeGeom]),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        store: redisStore,
        ...configService.get('redis'),
        ttl: CacheTtlSeconds.ONE_DAY,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ShapesResolver, ShapesService],
})
export class ShapesModule {}
