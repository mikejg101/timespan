import { Dependency } from './dependency';

/**
 * Represents a grouping of dependencies by a string key.
 */
export interface DependencyMap {
  [key: string]: Dependency;
}
