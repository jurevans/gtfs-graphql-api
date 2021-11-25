/**
 * Format key by appending argument parameters/values to a key prefix
 * @param keyPrefix
 * @param args
 * @returns {string}
 */
export const formatCacheKey = (
  keyPrefix: string,
  args?: { [key: string]: string | number },
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
 * Get current day of the week (e.g., 'monday', 'tuesday', etc.)
 * @returns {string}
 */
export const getCurrentDay = (): string => {
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
  return today;
};
