# GTFS GraphQL API

This is a GraphQL API that serves multiple [GTFS static feeds](https://gtfs.org/reference/static/) from a PostgreSQL database with the PostGIS extension enabled, allowing fetching of geometry data created from the static feeds.

### Table of Contents

- [Running the API](#running-the-api)
- [Testing the API](#testing-the-api)
- [Configuring the cache store (Redis)](#configuring-the-cache-store)
- [Configuring the database (PostgreSQL/PostGIS)](#configuring-the-database)
- [Querying the GraphQL API](#querying-gtfs-data-in-graphql)

## Running the API

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the API

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Configuring the cache store

This API uses Redis for caching and session management, which can be configured in `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_AUTH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Configuring the database

Example `.env` configuration:

```bash
DB_HOST=<hostname>
DB_PORT=5432
DB_USERNAME=<username>
DB_PASSWORD=<password>
DB_DATABASE=gtfs
```

This project depends on a PostgrSQL database populated using the gtfs-sql-importer: https://github.com/fitnr/gtfs-sql-importer. This requires a PostGIS-enabled PostgreSQL database.

Basic usage is as follows (executed from within the repo):

Export the following environment variables:

```bash
PGDATABASE=mydbname
PGHOST=example.com
PGUSER=username
```

(**NOTE**: You may need to export `PGPASSWORD=password` if not otherwise authenticated to use `psql`).

Then:

```bash
make init
make load GTFS=gtfs.zip
```

Where `gtfs.zip` is the name of the downloaded `.zip` file containing the GTFS data.

## Querying GTFS data in GraphQL

It should be fairly straight-forward to query GTFS data if you follow the specification laid out in detail [here](https://gtfs.org/reference/static/). You need to convert fields to camel-case (e.g., `route_id` => `routeId`), and use singular and plural depending on whether you want a single entity or multiple entities. Below are examples, along with cases where you can specify an addition parameter to query by, such as `trips`, which can take a `routeId` to only return trips for that route.

**NOTE**: You must _always_ specify a `feedIndex`, unless you are querying for all feeds in the database.

**NOTE**: Generally, getting a group of entities will only return the top-level entity, except in cases such as Feeds where it might be useful to grab Agency and Route data. This may change, and I may add query parameters to make it easier to get more deeply nested structures if it seems useful and performant enough.

Get all feeds, along with the associated Agency and Routes:

```graphql
query {
  feeds {
    feedId
    feedLang
    agencies {
      agencyId
      agencyName
      agencyUrl
      agencyPhone
    }
    routes {
      routeId
      routeShortName
      routeDesc
    }
  }
}
```

Get all Routes:

```graphql
query {
  routes(feedIndex: 1) {
    routeId
    routeDesc
    routeColor
  }
}
```

Get a specific Route:

```graphql
query {
  route(feedIndex: 1, routeId: "B") {
    routeId
    routeUrl
    routeDesc
    routeColor
    routeShortName
    routeLongName
    routeType {
      routeType
      description
    }
    transfers {
      fromStopId
      toStopId
    }
  }
}
```

Get all Trips:

```graphql
query {
  trips(feedIndex: 1) {
    tripId
    tripHeadsign
    routeId
    tripType
    directionId
  }
}
```

Get a Trip, along with Route info, StopTimes with their associated stop and stop Point geometry, as well as the geometries for the shape associated with this trip:

```graphql
query {
  trip(feedIndex: 1, tripId: "ASP21GEN-1037-Sunday-00_000600_1..S03R") {
    tripId
    tripHeadsign
    tripShortName
    route {
      routeId
      routeDesc
    }
    shape {
      shapeGeom {
        shapeId
        theGeom {
          type
          coordinates
        }
      }
    }
    stopTimes {
      stopId
      stopSequence
      stop {
        stopId
        stopName
        stopDesc
        parentStation
        theGeom {
          type
          coordinates
        }
      }
    }
  }
}
```
