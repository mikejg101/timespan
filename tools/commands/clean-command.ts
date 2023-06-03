import fs from 'fs';
import path from 'path';
import { buildHeader } from '../core/header-builder';
import { Command } from '../types/command';

export class CleanCommand implements Command {
  public readonly command = 'clean';
  public readonly description = 'Clean project';

  public async handler(): Promise<number> {
    try {
      // eslint-disable-next-line no-underscore/no-underscore
      this.deleteFolderRecursive(path.join(__dirname, '..', '..', '/dist'));
      const header = buildHeader(`Successfully cleaned dist folder`, false);
      console.log(header);
      return 0;
    } catch {
      const header = buildHeader(`Unable to clean dist folder`, true);
      console.log(header);
      return 1;
    }
  }

  private deleteFolderRecursive(folderPath: string): void {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
}
