import fs from 'fs';
import Path from 'path';

const deleteFolderRecursive = (path: string) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// eslint-disable-next-line no-underscore/no-underscore
deleteFolderRecursive(Path.join(__dirname, '../dist'));
