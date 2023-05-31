// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/license-compatibility-checker.d.ts" />
import { Command } from '../types/command';
import lcc from 'license-compatibility-checker';
import path from 'path';
import intersect from 'intersect';
import { readPackageJson } from '../core/read-package-json';
import { buildHeader } from '../core/header-builder';

export class LicensesCheckCommand implements Command {
  public readonly command = 'licenses-check';
  public readonly description = 'Check project licenses';
  private readonly log = console.log;
  private readonly incompatibleRegex = /incompatible/g;
  private readonly errorTitle = 'License Issues Found In Production Packages.';
  private readonly successTitle =
    'No License Issues Found In Production Packages.';
  private readonly packageJsonPath = path.join(process.cwd(), 'package.json');
  private readonly nodeModulesPath = path.join(process.cwd(), 'node_modules');

  /**
   * Handles the license check.
   * @returns The exit code. 0 if there was no incompatible licenses,
   * 1 if there was any incompatible licenses.
   */
  public async handler(): Promise<number> {
    try {
      return await this.runLicenseCheck();
    } catch (e) {
      return 1;
    }
  }

  /**
   * Runs the license check.
   * @returns The exit code. 0 if there was no incompatible licenses,
   * 1 if there was any incompatible licenses.
   */
  private runLicenseCheck = async (): Promise<number> => {
    // Prevent the license checker from logging issues with no license.
    console.log = () => {
      return;
    };

    const licenseWithCompatibilityInfoLines =
      await this.getLicensesWithCompatibilityInfo();

    // Reset the console so we can log.
    console.log = this.log;

    // Read the package.json file.
    const productionDependencyNames = this.getProductionDependencies();

    const incompatibleProductionPackages = intersect(
      productionDependencyNames,
      licenseWithCompatibilityInfoLines
        .filter((line) => line.match(this.incompatibleRegex))
        .map((found) => found.split('@')[0]),
    );

    // Determine if any of the license issues are associated with
    // production packages.
    const hasIncompatibleLicenses = incompatibleProductionPackages.length > 0;

    // Print the results.
    const packageLicenses = this.getPackageLicenses(
      productionDependencyNames,
      licenseWithCompatibilityInfoLines,
    );

    const header = buildHeader(
      hasIncompatibleLicenses ? this.errorTitle : this.successTitle,
      hasIncompatibleLicenses,
    );

    const results = [header].concat(packageLicenses).join('\n').trimEnd();

    console.log(results);

    return hasIncompatibleLicenses ? 1 : 0;
  };

  /**
   * Get the licenses for the packages passed into the function.
   * @param packages The packages to check.
   * @param licenses The licenses to search.
   * @returns The list of package licenses.
   */
  private getPackageLicenses = (
    packages: string[],
    licenses: string[],
  ): string[] => {
    return packages
      .map(
        (packageName: string) =>
          licenses.find((line: string) => line.match(packageName)) || '',
      )
      .filter((line?: string) => line && line.trim() !== '');
  };

  /**
   * Returns the licenses with compatibility info.
   * @returns The licenses with compatibility info.
   */
  private getLicensesWithCompatibilityInfo = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      lcc.check(
        this.packageJsonPath,
        this.nodeModulesPath,
        (err: Error, passed: boolean, output: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(output.split('\n'));
          }
        },
      );
    });
  };

  /**
   * Get the production dependencies from the package.json.
   * @returns The production dependencies.
   */
  private getProductionDependencies = (): string[] => {
    // Read the package.json file.
    const packageJson = readPackageJson();

    // Return the keys since they are the package names.
    return Object.keys(packageJson?.dependencies || []);
  };
}
