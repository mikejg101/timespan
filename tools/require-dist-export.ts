/*
  eslint-disable
  no-underscore/no-underscore,
  @typescript-eslint/no-var-requires,
*/

import path from 'path';
import fs from 'fs';

/**
 * Require an export from the distribution package.
 * @param name The name of the export to require.
 * @returns The required export.
 */
export function requireDistExport<T = unknown>(name: string): T {
  const distPath = path.resolve(__dirname, '../dist/index.js');
  console.log(distPath);
  if (!fs.existsSync(distPath)) {
    throw new Error(
      'Distribution package not found. Run `npm run build` first.',
    );
  }
  const mod = require(distPath);
  if (!(name in mod)) {
    throw new Error(`Export "${name}" not found in dist package.`);
  }
  return mod[name] as T;
}
