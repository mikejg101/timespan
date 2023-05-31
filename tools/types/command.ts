import { Argv } from 'yargs';
import { Arguments } from 'yargs';

export interface Command {
  command: string;
  description: string;
  builder?(yargs: Argv<unknown>): Argv<unknown>;
  handler(argv: Arguments): Promise<number | undefined>;
}
