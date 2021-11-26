import { IPostgresInterval } from 'postgres-interval';
import { Duration } from 'luxon';

export const intervalTransformer = {
  to: (seconds: number): string => `${seconds} seconds`,
  from: (interval: IPostgresInterval): number => {
    const isoDuration = interval.toISOString();
    const duration = Duration.fromISO(isoDuration);
    return duration.seconds;
  },
};
