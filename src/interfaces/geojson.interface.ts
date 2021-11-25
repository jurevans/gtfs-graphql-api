/**
 * Types for GeoJSON data
 */
export type ICoordinate = [number, number];

export interface IPoint {
  type: 'Point';
  coordinates: ICoordinate[];
}

export interface ILineString {
  type: 'LineString';
  coordinates: ICoordinate[][];
}

export interface IFeature {
  type: string;
  geometry: IPoint | ILineString;
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
