/**
 * Types for GeoJSON data
 */
export type ICoordinate = [number, number];

export interface IGeometry {
  type: 'LineString' | 'Point' | 'Polygon'; // There are others, but will not likely be used here
  coordinates: ICoordinate[];
}

export interface IFeature {
  type: string;
  geometry: IGeometry;
  properties: {
    id: string;
    name: string;
    longName?: string;
    color?: string;
    description?: string;
    url?: string;
    routeid?: string;
    length?: number;
  };
}

export interface IFeatureCollection {
  type: string;
  features: IFeature[];
}
