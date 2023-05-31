import fs from 'fs';
import path from 'path';
import { PackageJson } from '../types';

/**
 * Reads the package.json file and returns its contents.
 * @returns The parsed package.json object or null if there was an error.
 */
export const readPackageJson = (): PackageJson | null => {
  // eslint-disable-next-line no-underscore/no-underscore
  const filePath = path.join(__dirname, '..', '..', 'package.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const packageJson = JSON.parse(fileContent);
  return packageJson as PackageJson;
};
