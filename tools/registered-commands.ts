import {
  ChangelogCommand,
  CleanCommand,
  DependenciesCheckCommand,
  LicensesCheckCommand,
  NoConsoleCommand,
  UpdatePackageJsonCommand,
} from './commands';
import { CommandInvoker } from './core/command-invoker';

// Create an instance of the invoker
export const invoker = new CommandInvoker();

// ADD COMMANDS UNDER HERE !!!!!
invoker.register(new ChangelogCommand());
invoker.register(new CleanCommand());
invoker.register(new DependenciesCheckCommand());
invoker.register(new LicensesCheckCommand());
invoker.register(new UpdatePackageJsonCommand());
invoker.register(new NoConsoleCommand());
