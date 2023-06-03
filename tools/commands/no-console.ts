import fs from 'fs';
import path from 'path';
import { buildHeader } from '../core/header-builder';
import { Command } from '../types/command';

export class NoConsoleCommand implements Command {
  public readonly command = 'no-console';
  public readonly description =
    "Ensure project doesn't include a call to console";

  public async handler(): Promise<number> {
    try {
      // eslint-disable-next-line no-underscore/no-underscore
      this.checkFilesForConsoleLog(path.join(__dirname, '..', '..', '/src'));
      const header = buildHeader(
        `No console statements found in any files.`,
        false,
      );
      console.log(header);
      return 0;
    } catch (e) {
      const header = buildHeader(
        e instanceof Error ? e.message : 'Error Checking Source Files',
        true,
      );
      console.log(header);
      return 1;
    }
  }

  private checkFilesForConsoleLog(folderPath: string): void {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        this.checkPath(`${folderPath}/${file}`);
      }
    }
  }

  private checkFile(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes('console')) {
      throw new Error(`Console found in file: ${filePath}`);
    }
  }

  private checkPath(path: string) {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      this.checkFilesForConsoleLog(path);
    } else if (stats.isFile() && path.endsWith('.ts')) {
      this.checkFile(path);
    }
  }
}
