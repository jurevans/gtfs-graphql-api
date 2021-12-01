import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import authConfig from 'config/auth.config';
import redisConfig from 'config/redis.config';
import databaseConfig from 'config/database.config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from 'auth/auth.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { FeedModule } from './feeds/feed.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { StopsModule } from './stops/stops.module';
import { ShapesModule } from './shapes/shapes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, redisConfig, databaseConfig],
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleAsyncOptions> =>
        Object.assign(await getConnectionOptions(), {
          ...configService.get('database'),
          autoLoadEntities: true,
        }),
      inject: [ConfigService],
    }),
    FeedModule,
    RoutesModule,
    TripsModule,
    StopsModule,
    AuthModule,
    ShapesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}
