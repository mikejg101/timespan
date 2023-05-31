import fs from 'fs';
import path from 'path';
import { ToolsJson } from '../types';

/**
 * Reads the package.json file and returns its contents.
 * @returns The parsed package.json object or null if there was an error.
 */
export const readToolsJson = (): ToolsJson | null => {
  // eslint-disable-next-line no-underscore/no-underscore
  const filePath = path.join(__dirname, '..', '..', 'tools.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const toolsJson = JSON.parse(fileContent);
  return toolsJson as ToolsJson;
};
