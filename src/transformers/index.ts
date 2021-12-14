import { IPostgresInterval } from 'postgres-interval';
import { DateTime } from 'luxon';

export const intervalToTime = {
  to: (value: IPostgresInterval): IPostgresInterval => value,
  from: (value: IPostgresInterval): string => {
    const { hours: hour, minutes: minute, seconds: second } = value;

    const time = DateTime.fromObject({
      hour,
      minute,
      second,
    })
      .setZone('America/New_York')
      .toLocaleString(DateTime.TIME_SIMPLE);

    return time;
  },
};
