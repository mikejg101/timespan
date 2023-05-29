// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./tools.d.ts" />

import lcc from 'license-compatibility-checker';
import path from 'path';
import intersect from 'intersect';
import fs from 'fs';

// Get a reference to the console logger so we can turn it back on if needed.
const log = console.log;

const packageJsonPath = path.join(process.cwd(), 'package.json');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const regex = /incompatible/g;
const errorTitle = 'License Issues Found In Production Packages.';
const successTitle = 'No License Issues Found In Production Packages.';
const colors = {
  success: '\x1B[32m',
  warning: '\x1B[33m',
  error: '\x1B[31m',
  default: '\x1B[39m',
};

/**
 * Returns the header to be displayed in the console.
 * @param hasError Whether the header should include the standard title or the error title.
 * @returns The header string.
 */
const getHeader = (hasError = false): string => {
  const color = getStatusColor(hasError ? 'error' : 'success');
  const paddedTitle = (hasError ? errorTitle : successTitle).padEnd(66, ' ');
  const paddedBorder = `${color}`.padEnd(74, '*') + '\x1B[39m';
  return `${color}${paddedBorder}\x1B[39m\n${color}* ${paddedTitle}*\x1B[39m\n${color}${paddedBorder}\x1B[39m`;
};

/**
 * Returns the status color from the color table. Returns the default
 * color if the specified status is not found.
 * @param status The status from the colors table.
 * @returns The status color.
 */
const getStatusColor = (status: keyof typeof colors): string => {
  const color = colors[status];
  return color ? color : colors.default;
};

/**
 * Get the licenses for the packages passed into the function.
 * @param packages The packages to check.
 * @param licenses The licenses to search.
 * @returns The list of package licenses.
 */
const getPackageLicenses = (packages: string[], licenses: string[]): string => {
  return packages
    .map((packageName: string) =>
      licenses.find((line: string) => line.match(packageName))
    )
    .filter((line?: string) => !line || line.trim() !== '')
    .join('\n');
};

/**
 * Get the production dependencies from the package.json.
 * @param packageJsonPath The path to the package.json file.
 * @returns The production dependencies.
 */
const getProductionDependencies = (packageJsonPath: string): string[] => {
  try {
    // Read the package.json file.
    const packageContents = fs.readFileSync(packageJsonPath, {
      encoding: 'utf-8',
    });

    // Parse it into JSON.
    const packageJson = JSON.parse(packageContents);

    // Return the keys since they are the package names.
    return Object.keys(packageJson?.dependencies || []);
  } catch (error) {
    console.error(`Error reading package.json: ${error}`);
    return [];
  }
};

/**
 * Returns the licenses with compatibility info.
 * @returns The licenses with compatibility info.
 */
const getLicensesWithCompatibilityInfo = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    lcc.check(
      packageJsonPath,
      nodeModulesPath,
      (err: Error, passed: boolean, output: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(output.split('\n'));
        }
      }
    );
  });
};

(async () => {
  try {
    // Prevent the license checker from logging issues with no license.
    console.log = () => {
      return;
    };

    const licenseWithCompatibilityInfoLines =
      await getLicensesWithCompatibilityInfo();

    // Reset the console so we can log.
    console.log = log;

    // Read the package.json file.
    const productionDependencyNames =
      getProductionDependencies(packageJsonPath);

    const incompatibleProductionPackages = intersect(
      productionDependencyNames,
      licenseWithCompatibilityInfoLines
        .filter((line) => line.match(regex))
        .map((found) => found.split('@')[0])
    );

    // Determine if any of the license issues are associated with
    // production packages.
    const hasIncompatibleLicenses = incompatibleProductionPackages.length > 0;

    // Print the results.
    const packageLicenses = getPackageLicenses(
      productionDependencyNames,
      licenseWithCompatibilityInfoLines
    );

    const results = [getHeader(hasIncompatibleLicenses)]
      .concat(packageLicenses)
      .join('\n');

    console.log(results + '\n');

    // Throw an error for CI builds to fail if there are license issues.
    if (hasIncompatibleLicenses) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Unable to check licenses: ${error}`);
    process.exit(1);
  }
})();
