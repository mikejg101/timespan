import { Command } from '../types/command';
import { Arguments } from 'yargs';

export class CommandInvoker {
  private commands: Command[] = [];

  public register(command: Command): void {
    this.commands.push(command);
  }

  public getCommands(): Command[] {
    return this.commands;
  }

  public async execute(commandName: string, argv: Arguments): Promise<void> {
    const command = this.commands.find((cmd) => cmd.command === commandName);
    if (command) {
      process.exitCode = (await command.handler(argv)) || 0;
    } else {
      console.log(`Command '${commandName}' not recognized.`);
    }
  }
}
