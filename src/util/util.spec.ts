import { formatCacheKey, getDayOfWeekForTimezone } from 'util/';
import { CacheKeyPrefix } from 'constants/';

describe('formatCacheKey', () => {
  it('should return correctly formatted keys', () => {
    const expected = 'routes?feedIndex=1&routeId=A';

    const actual = formatCacheKey(CacheKeyPrefix.ROUTES, {
      feedIndex: 1,
      routeId: 'A',
    });

    expect(actual).toBe(expected);
  });

  it('should remove parameters with undefined values', () => {
    const expected = 'routes?feedIndex=1';

    const actual = formatCacheKey(CacheKeyPrefix.ROUTES, {
      feedIndex: 1,
      routeId: null,
    });

    expect(actual).toBe(expected);
  });
});

describe('getDayOfWeekForTimezone', () => {
  it('should return the correct day', () => {
    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = daysOfWeek[new Date().getDay()];

    expect(getDayOfWeekForTimezone('America/New_York')).toBe(today);
  });
});
