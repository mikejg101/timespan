// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./tools.d.ts" />

import lcc from 'license-compatibility-checker';
import path from 'path';
import intersect from 'intersect';
import fs from 'fs';

// Get a reference to the console logger so we can turn it back on if needed.
const log = console.log;

const pathOfPackageJson = path.join(process.cwd(), 'package.json');
const pathOfModules = path.join(process.cwd(), 'node_modules');
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
 * @param hasError wether the header to include the standard title or the error title.
 * @returns the header string.
 */
const getHeader = (hasError = false) => {
  const color = getStatusColor(hasError ? 'error' : 'success');
  const paddedTitle = (hasError ? errorTitle : successTitle).padEnd(66, ' ');
  const paddedBorder = `${color}`.padEnd(74, '*') + '\x1B[39m';
  return `${color}${paddedBorder}\x1B[39m\n${color}* ${paddedTitle}*\x1B[39m\n${color}${paddedBorder}\x1B[39m`;
};

/**
 * Returns the status color from the color table. Returns the default
 * color if the specified status is not found.
 * @param status the status from the colors table.
 * @returns the status color.
 */
const getStatusColor = (status: keyof typeof colors) => {
  const color = colors[status];
  return color ? color : colors.default;
};

/**
 * Get the licenses for the packages passed into the function.
 * @param packages The packages to check
 * @param licenses The licenses to search
 * @returns The list of packages licenses
 */
const getPackageLicenses = (packages: string[], licenses: string[]) => {
  return packages
    .map((packageName: string) =>
      licenses.find((line: string) => line.match(packageName))
    )
    .filter((line?: string) => !line || line.trim() !== '')
    .join('\n');
};

/**
 * Get the production dependencies from the package.json
 * @param path the path to the package.json file.
 * @returns the production dependencies.
 */
const getProductionDependencies = (path: string) => {
  try {
    // Read the package.json file.
    const packageContents = fs.readFileSync(path, {
      encoding: 'utf-8',
    });

    // Parse it into json.
    const packageJson = JSON.parse(packageContents);

    // Return the keys since they are the package names.
    return Object.keys(packageJson?.dependencies || []);
  } catch {
    return [];
  }
};

/**
 * Returns the licenses with compatibility info
 * @returns The licenses with compatibility info
 */
const getLicensesWithCompatibilityInfo = () =>
  new Promise(
    (
      resolve: (licenseWithCompatibilityInfoLines: string[]) => void,
      reject
    ) => {
      lcc.check(
        pathOfPackageJson,
        pathOfModules,
        (err: Error, passed: boolean, output: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(output.split('\n'));
          }
        }
      );
    }
  );

(async () => {
  try {
    // Prevent the license checker logging issues with no license.
    console.log = () => {
      return;
    };
    const licenseWithCompatibilityInfoLines =
      await getLicensesWithCompatibilityInfo();

    // Reset the console so we can log.
    console.log = log;

    // Read the package.json file.
    const productionDependencyNames =
      getProductionDependencies(pathOfPackageJson);

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

    // Throw an error for CI builds to fail if there are license
    // issues.
    if (hasIncompatibleLicenses) {
      process.exit(1);
    }
  } catch {
    console.log('Unable to check licenses.');
    process.exit(1);
  }
})();
