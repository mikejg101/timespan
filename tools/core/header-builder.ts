const colors: { [key: string]: string } = {
  success: '\x1B[32m',
  warning: '\x1B[33m',
  error: '\x1B[31m',
  default: '\x1B[39m',
};

/**
 * Generates the header for console output.
 * @param title The title of the header.
 * @param hasError Indicates whether the check failed.
 * @returns The header string.
 */
export function buildHeader(title: string, hasError: boolean): string {
  const color = getHeaderColor(hasError ? 'error' : 'success');
  const paddedTitle = title.padEnd(0, ' ');
  const headerTitle = `${color}* ${paddedTitle} *`;
  const paddedBorder = `${color}`.padEnd(headerTitle.length, '*') + '\x1B[39m';
  const headerBorder = `${color}${paddedBorder}\x1B[39m\n`;
  return `${headerBorder}${headerTitle}\x1B[39m\n${headerBorder}`;
}

/**
 * Gets the color for the header based on the status.
 * @param status The status of the check.
 * @returns The color string.
 */
function getHeaderColor(status: string): string {
  const color = colors[status];
  return color ? color : colors.default;
}
