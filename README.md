# GTFS GraphQL API

This is a GraphQL API that serves multiple [GTFS static feeds](https://gtfs.org/reference/static/) from a PostgreSQL database with the PostGIS extension enabled, allowing fetching of geometry data created from the static feeds.

### Table of Contents

- [Running the API](#running-the-api)
- [Testing the API](#testing-the-api)
- [Configuring authentication](#configuring-authentication)
- [Configuring the cache store (Redis)](#configuring-the-cache-store)
- [Configuring the database (PostgreSQL/PostGIS)](#configuring-the-database)
- [Querying the GraphQL API](#querying-gtfs-data-in-graphql)
  - [Querying Feeds](#querying-feeds)
  - [Querying Routes](#querying-routes)
  - [Querying Trips](#querying-trips)
  - [Querying Shapes](#querying-shapes)
  - [Querying Stops](#querying-stops)
    - [Stops with Transfers](#stops-with-transfers)
    - [Querying multiple Stops](#querying-multiple-stops)
- [Entity Relationship Diagram](#generated-erd)

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

## Configuring Authentication

This API requires an `x-api-key` header to be sent with a valid key. These keys are defined in an `API_KEYS` variable in `.env`, separated by commas:

```bash
API_KEYS=1XXXXXXXXXXXXXX,2XXXXXXXXXXXXXX,3XXXXXXXXXXXXXX
```

I am using the [Insomnia](https://insomnia.rest/) client, however, if you want to use the GraphQL Playground interface in your browser, you can send this header with [ModHeader](https://modheader.com/) extension. If you use ModHeader, you can add an `x-api-key` request header, then add a Filter with a URL Pattern of `http:\/\/localhost:4000\/graphql` to authenticate.

## Configuring the cache store

This API uses Redis for caching and session management, which can be configured in `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_AUTH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

[ [Table of Contents](#table-of-contents) ]

## Configuring the database

Example `.env` configuration:

```bash
DB_HOST=<hostname>
DB_PORT=5432
DB_USERNAME=<username>
DB_PASSWORD=<password>
DB_DATABASE=gtfs
```

This project depends on a PostgrSQL database populated using the [gtfs-sql-importer](https://github.com/fitnr/gtfs-sql-importer). This requires a PostGIS-enabled PostgreSQL database:

```bash
# Switch to user "postgres"
sudo su postgres

# Run psql
psql

# From the psql prompt, select database
psql> \c gtfs_db

# Create PostGIS extension
CREATE EXTENSION postgis
```

Basic usage of `gtfs-sql-importer` is as follows (executed from within the repo):

Export the following environment variables:

```bash
PGDATABASE=mydbname
PGHOST=example.com
PGUSER=username
PGPASSWORD=password
```

Then, from the root directory of `gtfs-sql-importer/`:

```bash
make init
make load GTFS=/path/to/gtfs.zip
```

Where `gtfs.zip` is the name of the downloaded `.zip` file containing the GTFS data.

### View the entity relationship diagram (ERD) generated for the created database [here](#generated-erd).

[ [Table of Contents](#table-of-contents) ]

## Querying GTFS data in GraphQL

It should be fairly straight-forward to query GTFS data if you follow the specification laid out in detail [here](https://gtfs.org/reference/static/). You need to convert fields to camel-case (e.g., `route_id` => `routeId`), and use singular and plural depending on whether you want a single entity or multiple entities. Below are examples, along with cases where you can specify an addition parameter to query by, such as `trips`, which can take a `routeId` to only return trips for that route.

**NOTE**: You must _always_ specify a `feedIndex`, unless you are querying for all feeds in the database.

**NOTE**: Generally, getting a group of entities will only return the top-level entity, except in cases such as Feeds where it might be useful to grab Agency and Route data. This may change, and I may add query parameters to make it easier to get more deeply nested structures if it seems useful and performant enough.

[ [Table of Contents](#table-of-contents) ]

### Querying Feeds

Get all feeds, along with the associated Agency and Routes - this is the initial request, as `feedIndex` is required on all subsequent queries:

```graphql
{
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

[ [Table of Contents](#table-of-contents) ]

### Querying Routes

Get all Routes:

```graphql
{
  routes(feedIndex: 1) {
    routeId
    routeDesc
    routeColor
  }
}
```

Get a specific Route:

```graphql
{
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

[ [Table of Contents](#table-of-contents) ]

### Querying Trips

Get all Trips (you can also specify `serviceId`):

```graphql
{
  trips(feedIndex: 1) {
    tripId
    tripHeadsign
    routeId
    tripType
    directionId
  }
}
```

Get the next available trip by `routeId` and `directionId` (`directionId` can be `0` or `1`, and defaults to `0` if unspecified), this returns useful information that can be used by the client to render a valid route, it's stops, and `shapeId` (see [shape queries](#querying-shapes) below):

```graphql
{
  nextTrip(feedIndex: 1, routeId: "7", directionId: 1) {
    tripId
    tripHeadsign
    directionId
    shapeId
    route {
      routeId
      routeShortName
      routeLongName
      routeDesc
      routeColor
    }
    stopTimes {
      stopSequence
      departureTime {
        hours
        minutes
        seconds
      }
      stop {
        stopName
        geom {
          coordinates
        }
      }
    }
  }
}
```

Get a Trip, along with Route info, StopTimes with their associated stop and `Point` geometry:

```graphql
{
  trip(feedIndex: 1, tripId: "ASP21GEN-1037-Sunday-00_000600_1..S03R") {
    tripId
    tripHeadsign
    tripShortName
    route {
      routeId
      routeDesc
    }
    stopTimes {
      stopId
      stopSequence
      stop {
        stopName
        stopDesc
        parentStation
        geom {
          type
          coordinates
        }
      }
      departureTime {
        hours
        minutes
        seconds
      }
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

### Querying Shapes

Once we have trips, with their respective `shapeId`s, we can query for the actual shape geometry:

Multiple shapes:

(**NOTE**: You can also specify `shapeIds: "7..N97R"` to return a single shape, just know that it will still be returned in an array.)

```graphql
{
  shapes(shapeIds: ["7..N97R", "7..S97R"]) {
    shapeId
    geom {
      type
      coordinates
    }
  }
}
```

A single shape:

```graphql
{
  shape(shapeId: "7..N97R") {
    shapeId
    length
    geom {
      type
      coordinates
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

### Querying Stops

**NOTE**: A `Stop` can have a `parentStation` defined. A `parentStation` might be have a `stopId` of `101`, and two stops that have this as a `parentStation` might be `101N` and `101S`, indicating separate stops for each direction. We can specify all, only parents, and only children in the query using `isParent: true` or `isChild: true`, or omitting those values to get all stop entires:

Get all stops:

```graphql
{
  stops(feedIndex: 1) {
    stopId
    stopName
    geom {
      type
      coordinates
    }
  }
}
```

Get all stops that are Parent Stations:

```graphql
{
  stops(feedIndex: 1, isParent: true) {
    stopId
    stopName
    geom {
      type
      coordinates
    }
  }
}
```

Get all stops that are _not_ Parent Stations:

```graphql
{
  stops(feedIndex: 1, isChild: true) {
    stopId
    stopName
    geom {
      type
      coordinates
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

#### Stops with Transfers

Get a stop, along with its transfers (and transfer-types, just to illustrate what that actually gives us):

```graphql
{
  stop(feedIndex: 1, stopId: "127") {
    stopId
    stopName
    parentStation
    stopTimezone
    geom {
      type
      coordinates
    }
    locationType {
      locationType
      description
    }
    transfers {
      toStopId
      fromStopId
      minTransferTime
      transferType {
        transferType
        description
      }
    }
  }
}
```

**NOTE**: If a stop _isn't_ a `parentStation`, transfers will be empty (at least according to the MTA data). Querying a parent station should yield a populated `transfers` array, however, there is always a `transfers` table entry for the stop itself (perhaps to transfer from Inbound to Outbound), as you can see in the following data:

```json
{
  "data": {
    "stop": {
      "stopId": "127",
      "stopName": "Times Sq-42 St",
      "parentStation": null,
      "stopTimezone": null,
      "geom": {
        "type": "Point",
        "coordinates": [-73.987495, 40.75529]
      },
      "locationType": {
        "locationType": 1,
        "description": "station"
      },
      "transfers": [
        {
          "toStopId": "127",
          "fromStopId": "127",
          "minTransferTime": 0,
          "transferType": {
            "transferType": 2,
            "description": "Transfer possible with min_transfer_time window"
          }
        },
        {
          "toStopId": "725",
          "fromStopId": "127",
          "minTransferTime": 180,
          "transferType": {
            "transferType": 2,
            "description": "Transfer possible with min_transfer_time window"
          }
        },
        {
          "toStopId": "902",
          "fromStopId": "127",
          "minTransferTime": 180,
          "transferType": {
            "transferType": 2,
            "description": "Transfer possible with min_transfer_time window"
          }
        },
        {
          "toStopId": "A27",
          "fromStopId": "127",
          "minTransferTime": 300,
          "transferType": {
            "transferType": 2,
            "description": "Transfer possible with min_transfer_time window"
          }
        },
        {
          "toStopId": "R16",
          "fromStopId": "127",
          "minTransferTime": 180,
          "transferType": {
            "transferType": 2,
            "description": "Transfer possible with min_transfer_time window"
          }
        }
      ]
    }
  }
}
```

[ [Table of Contents](#table-of-contents) ]

#### Querying multiple Stops

You can see in the `locationType` section above that the `locationType` is `station`. For "child" stops (e.g., `127N` or `127S`), you would have a `locationType` of `stop`. We've also recieved an array of "stations" that are available for transfer after the `minTransferTime` value (in seconds). These transfers can be queried together for additional detail as such:

```graphql
{
  stops(feedIndex: 1, stopIds: ["127", "725", "902", "A27", "R16"]) {
    stopId
    stopName
    geom {
      type
      coordinates
    }
  }
}
```

Which yields the following:

```json
{
  "data": {
    "stops": [
      {
        "stopId": "127",
        "stopName": "Times Sq-42 St",
        "geom": {
          "type": "Point",
          "coordinates": [-73.987495, 40.75529]
        }
      },
      {
        "stopId": "725",
        "stopName": "Times Sq-42 St",
        "geom": {
          "type": "Point",
          "coordinates": [-73.987691, 40.755477]
        }
      },
      {
        "stopId": "902",
        "stopName": "Times Sq-42 St",
        "geom": {
          "type": "Point",
          "coordinates": [-73.986229, 40.755983]
        }
      },
      {
        "stopId": "A27",
        "stopName": "42 St-Port Authority Bus Terminal",
        "geom": {
          "type": "Point",
          "coordinates": [-73.989735, 40.757308]
        }
      },
      {
        "stopId": "R16",
        "stopName": "Times Sq-42 St",
        "geom": {
          "type": "Point",
          "coordinates": [-73.986754, 40.754672]
        }
      }
    ]
  }
}
```

[ [Table of Contents](#table-of-contents) ]

#### Querying Transfers

If you have a station ID (e.g., `127`, the `parentStation` of stop `127N` and `127S`), you can query for the stops associated with the `transfers` stations, for instance, if you are wanting to match a station with real-time `tripUpdate` and `vehicle` data, which is keyed by `stopId`:

```graphql
{
  transfers(feedIndex: 1, parentStation: "127") {
    stopId
  }
}
```

Which yields:

```json
{
  "data": {
    "transfers": [
      {
        "stopId": "127N"
      },
      {
        "stopId": "127S"
      },
      {
        "stopId": "725N"
      },
      {
        "stopId": "725S"
      },
      {
        "stopId": "902N"
      },
      {
        "stopId": "902S"
      },
      {
        "stopId": "A27N"
      },
      {
        "stopId": "A27S"
      },
      {
        "stopId": "R16N"
      },
      {
        "stopId": "R16S"
      }
    ]
  }
}
```

From this, you can easily filter the results from the real-time feed to get updates relevant to that particular station. **NOTE** that this query returns full stop entities, so you can also query for name and geometry.

## Generated ERD

The generated ERD of the PostgreSQL/PostGIS database:
![Generated ERD of GTFS Database](https://imgur.com/xn6JbgA.png)

[ [Table of Contents](#table-of-contents) ]
