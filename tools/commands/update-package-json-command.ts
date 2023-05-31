import { Arguments, Argv } from 'yargs';
import { Command } from '../types/command';
import fs from 'fs/promises';
import path from 'path';
import { buildHeader } from '../core/header-builder';

/**
 * Command class for updating project package.json.
 */
export class UpdatePackageJsonCommand implements Command {
  public readonly command = 'update <name> <value>';
  public readonly description = 'Update project package.json';
  // eslint-disable-next-line no-underscore/no-underscore
  private readonly filePath = path.join(__dirname, '..', '..', 'package.json');

  /**
   * Configure command options.
   * @param yargs - The yargs instance.
   * @returns The modified yargs instance.
   */
  public builder(yargs: Argv<unknown>): Argv<unknown> {
    return yargs
      .positional('name', {
        type: 'string',
        description: 'Name of the property',
      })
      .positional('value', {
        type: 'string',
        description: 'New value',
      });
  }

  /**
   * Handle the command execution.
   * @param yargs - The yargs instance with command arguments.
   * @returns A promise that resolves to the exit code.
   */
  public async handler(
    yargs: Arguments<{ name?: string; value?: string }>,
  ): Promise<number> {
    const { name, value } = yargs;
    if (name && value) {
      return await this.updatePackageJson(name, value);
    } else {
      return 1;
    }
  }

  /**
   * Update the package.json file with the provided name-value pair.
   * @param name - The name of the property to update.
   * @param value - The new value for the property.
   * @returns A promise that resolves to the exit code.
   */
  private updatePackageJson = async (
    name: string,
    value: string,
  ): Promise<number> => {
    // Read the existing package.json file
    const fileContents = await fs.readFile(this.filePath, 'utf-8');
    const file = JSON.parse(fileContents);

    // Validate and sanitize the key and value
    if (this.isValidKey(file, name) && this.isValidValue(file, name, value)) {
      // Update the value in the file object
      file[name] = value;

      // Write the updated package.json file
      await fs.writeFile(this.filePath, JSON.stringify(file, null, 2));
      const header = buildHeader(`Successfully updated key ${name}`, false);
      console.log(header);
      return 0;
    } else {
      const header = buildHeader(`Unable to update key ${name}`, true);
      console.log(header);
      return 1;
    }
  };

  /**
   * Check if the provided key is valid for the given object.
   * @param obj - The object to check for the key.
   * @param key - The key to validate.
   * @returns True if the key is valid, false otherwise.
   */
  private isValidKey(obj: Record<string, unknown>, key: string): boolean {
    return key in obj;
  }

  /**
   * Check if the provided value matches the type of the value at the given key in the object.
   * @param obj - The object containing the value.
   * @param key - The key of the value to check.
   * @param value - The value to validate.
   * @returns True if the value is of the same type, false otherwise.
   */
  private isValidValue(
    obj: Record<string, unknown>,
    key: string,
    value: unknown,
  ): boolean {
    // Get the existing value type at the key
    const existingValueType = typeof obj[key];

    // Check if the types match
    return typeof value === existingValueType;
  }
}
