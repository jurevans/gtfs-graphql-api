import { IPostgresInterval } from 'postgres-interval';
import { Duration } from 'luxon';
import { ValueTransformer } from 'typeorm';

export const intervalTransformer: ValueTransformer = {
  to: (seconds: number): string => `${seconds} seconds`,
  from: (interval: IPostgresInterval): number => {
    const isoDuration = interval.toISOString();
    const duration = Duration.fromISO(isoDuration);
    return duration.seconds;
  },
};
