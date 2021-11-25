import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import redisConfig from 'config/redis.config';
import databaseConfig from 'config/database.config';
import { GraphQLModule } from '@nestjs/graphql';
import { FeedModule } from './feeds/feed.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { StopsModule } from './stops/stops.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [redisConfig, databaseConfig],
    }),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
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
  ],
})
export class AppModule {}
