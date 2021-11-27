import { DateTime } from 'luxon';

/**
 * Format key by appending argument parameters/values to a key prefix
 * @param keyPrefix
 * @param args
 * @returns {string}
 */
export const formatCacheKey = (
  keyPrefix: string,
  args?: { [key: string]: string | number | boolean },
): string => {
  if (!args) {
    return keyPrefix;
  }

  return `${keyPrefix}?${Object.keys(args)
    .filter((key: string) => args[key])
    .map((key: string) => `${key}=${args[key]}`)
    .join('&')}`;
};

/**
 * Get current day for a specific timezone. This should match
 * the agencyTimezone value in the agencies table.
 * @param timezone
 * @returns {string}
 */
export const getDayOfWeekForTimezone = (timezone: string): string => {
  const datetime = DateTime.fromObject(null, { zone: timezone });
  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return daysOfWeek[datetime.weekday];
};
