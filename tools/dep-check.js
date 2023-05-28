/* eslint-disable */
const path = require('path');
const depcheck = require('depcheck');
const fs = require('fs');
const semver = require('semver');
/* eslint-enable */

const pathOfPackageJson = path.join(process.cwd(), 'package.json');
const errorTitle = 'Found Unused Dependencies.';
const successTitle = 'No Unused Dependencies.';
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

const options = {
  // ignore the packages with bin entry
  ignoreBinPackage: false,
  // skip calculation of missing dependencies
  skipMissing: false,
  // files matching these patterns will be ignored
  ignorePatterns: ['sandbox'],
  // the target parsers
  parsers: {
    '**/*.js': depcheck.parser.es6,
    '**/*.ts': depcheck.parser.typescript,
  },
  specials: [
    // the target special parsers
    depcheck.special.eslint,
  ],
};

depcheck(process.cwd(), options).then((unused) => {
  // an array containing the unused dependencies

  // Read the package.json file.
  const packageContents = fs.readFileSync(pathOfPackageJson, {
    encoding: 'utf-8',
  });

  // Parse it into json.
  const packageJson = JSON.parse(packageContents);

  console.log(getHeader(unused.dependencies.length > 0));

  if (unused.dependencies.length > 0) {
    const deps = Object.keys(packageJson.dependencies).reduce(
      (deps, packageName) => {
        deps[packageName] = {
          name: packageName,
          version: semver.coerce(packageJson.dependencies[packageName]).version,
          packageString: `${packageName}@${
            semver.coerce(packageJson.dependencies[packageName]).version
          }`,
        };
        return deps;
      },
      {}
    );
    unused.dependencies.forEach((dep) => console.log(deps[dep].packageString));
    process.exit(1);
  }
});
