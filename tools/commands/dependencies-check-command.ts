import depcheck, { Options, Parser } from 'depcheck';
import semver from 'semver';
import { buildHeader } from '../core/header-builder';
import { readPackageJson } from '../core/read-package-json';
import { DependencyMap } from '../types';
import { Command } from '../types/command';

export class DependenciesCheckCommand implements Command {
  public readonly command = 'dependencies-check';
  public readonly description = 'Check project dependencies';
  private readonly errorTitle = 'Found Unused Dependencies.';
  private readonly successTitle = 'No Unused Dependencies.';
  private readonly options: Options = {
    ignoreBinPackage: false,
    skipMissing: false,
    ignorePatterns: ['sandbox'],
    parsers: {
      '**/*.js': depcheck.parser.es6,
      '**/*.ts': depcheck.parser.typescript,
    },
    specials: [depcheck.special.eslint] as Parser[],
  };

  /**
   * Handles the dependency check.
   * @returns The exit code. 0 if there was no unused dependencies,
   * 1 if there were unused dependencies.
   */
  public async handler(): Promise<number> {
    try {
      return await this.runDepcheck();
    } catch (e) {
      return 1;
    }
  }

  private async runDepcheck(): Promise<number> {
    const packageJson = readPackageJson();
    if (!packageJson) {
      throw new Error('Cannot open package.json');
    }
    const currentWorkingDirectory = process.cwd();

    // Run depcheck
    const unused = await depcheck(currenWorkingDirectory, this.options);
    const unusedDependencies: DependencyMap = Object.entries(
      this.getProductionDependencies(),
    ).reduce((deps, [packageName, version]) => {
      deps[packageName] = {
        name: packageName,
        version: semver.coerce(version as string)?.version ?? '',
        packageString: `${packageName}@${
          semver.coerce(version as string)?.version ?? ''
        }`,
      };
      return deps;
    }, {} as DependencyMap);

    const header = buildHeader(
      unused.dependencies.length > 0 ? this.errorTitle : this.successTitle,
      unused.dependencies.length > 0,
    );

    // Output header
    console.log(header);

    // Output unused dependencies
    unused.dependencies
      .filter((l) => l.trim().length > 0)
      .forEach((dep) => console.log(unusedDependencies[dep].packageString));

    return unused.dependencies.length > 0 ? 1 : 0;
  }

  /**
   * Get the production dependencies from the package.json.
   * @returns The production dependencies.
   */
  private getProductionDependencies = (): { [key: string]: string } => {
    // Read the package.json file.
    const packageJson = readPackageJson();

    // Return the keys since they are the package names.
    return packageJson?.dependencies || {};
  };
}
