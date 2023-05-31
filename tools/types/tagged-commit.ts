import { Commit } from './commit';

export interface TaggedCommit {
  tag: string;
  commits: Commit[];
}
