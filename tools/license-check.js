/* eslint-disable */
const intersect = require('intersect');
const lcc = require('license-compatibility-checker');
const path = require('path');
const fs = require('fs');

// Store a reference to the default logger.
const log = console.log;

// Prevent the license checker logging issues with no license.
console.log = () => {};
/* eslint-enable */

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

// Build the result header.
// eslint-disable-next-line jsdoc/require-jsdoc
function getHeader(didFail) {
  const color = getHeaderColor(didFail ? 'error' : 'success');
  const paddedTitle = (didFail ? errorTitle : successTitle).padEnd(66, ' ');
  const paddedBorder = `${color}`.padEnd(74, '*') + '\x1B[39m';
  return `${color}${paddedBorder}\x1B[39m\n${color}* ${paddedTitle}*\x1B[39m\n${color}${paddedBorder}\x1B[39m`;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function getHeaderColor(status) {
  const color = colors[status];
  return color ? color : colors.default;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function getResults(packages, licenses, didFail) {
  return [getHeader(didFail)]
    .concat(
      packages
        .map((packageName) => licenses.find((line) => line.match(packageName)))
        .filter((lines) => !lines.trim() !== '')
    )
    .join('\n');
}

// eslint-disable-next-line jsdoc/require-jsdoc
function getProductionDependencies(path) {
  // Read the package.json file.
  const packageContents = fs.readFileSync(path, {
    encoding: 'utf-8',
  });

  // Parse it into json.
  const packageJson = JSON.parse(packageContents);

  // Return the keys since they are the package names.
  return Object.keys(packageJson?.dependencies || []);
}

// eslint-disable-next-line jsdoc/require-jsdoc
function onLicenseCheck(err, passed, output) {
  // Reset the console so we can log.
  console.log = log;

  // Check if there was an error running the actual license check.
  if (err) {
    // Go ahead and throw it so we can stop the CI build.
    throw err;
  }

  // Read the package.json file.
  const productionDependencyNames =
    getProductionDependencies(pathOfPackageJson);

  // Split the output lines into an array for searching.
  const outputLines = output.split('\n');

  // Get all of the lines that mention being incompatible and
  // are listed in the production packages of the package.json.
  const incompatibleProductionPackages = intersect(
    productionDependencyNames,
    outputLines
      .filter((line) => line.match(regex))
      .map((found) => found.split('@')[0])
  );

  // Determine if any of the license issues are associated with
  // production packages.
  const didFail = incompatibleProductionPackages.length > 0;

  // Print the results.
  const results = getResults(productionDependencyNames, outputLines, didFail);

  console.log(results + '\n');

  // Throw an error for CI builds to fail if there are license
  // issues.
  if (didFail) {
    process.exit(1);
  }
}

lcc.check(pathOfPackageJson, pathOfModules, onLicenseCheck);
