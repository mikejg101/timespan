import { execSync } from 'child_process';
import * as semver from 'semver';
import fs from 'fs';
import { Command } from '../types/command';
import { Commit, PackageJson, TaggedCommit, ToolsJson } from '../types';
import { buildHeader } from '../core/header-builder';
import { readToolsJson } from '../core/read-tools-json';
import { readPackageJson } from '../core/read-package-json';

export class ChangelogCommand implements Command {
  public readonly command = 'changelog';
  public readonly description = 'Generate changelog';
  private readonly defaultAllowedPrefixes = ['feat'];

  /**
   * Handles the generation of the changelog.
   * @returns The exit code. 0 if successful, 1 if there was an error.
   */
  public async handler(): Promise<number> {
    try {
      const taggedCommits = this.getCommitsWithTags();
      this.generateChangelog(taggedCommits, 'changelog.md');
      const header = buildHeader('Successfully Generated Changelog', false);
      console.log(header);
      return 0;
    } catch {
      const header = buildHeader('Failed To Generate Changelog', true);
      console.log(header);
      return 1;
    }
  }

  /**
   * Retrieves the commit message for a given commit hash.
   * @param hash The commit hash.
   * @returns The commit message.
   */
  private getCommitMessage = (hash: string): string => {
    return execSync(`git log --format=%B -n 1 ${hash}`).toString().trim();
  };

  /**
   * Retrieves the most recent tag associated with a given commit hash.
   * If no tag is found, it generates a tag based on the package.json version.
   * @param hash The commit hash.
   * @param toolsJson The parsed tools.json object.
   * @param packageJson The parsed package.json object.
   * @returns The most recent tag or a generated tag if none found.
   */
  private getRecentTag = (
    hash: string,
    toolsJson: ToolsJson,
    packageJson: PackageJson,
  ): string | null => {
    let tag: string | null;
    try {
      tag = execSync(`git describe --tags --abbrev=0 ${hash}`, {
        stdio: ['pipe', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
    } catch {
      if (
        toolsJson.changelog?.initialVersion &&
        toolsJson.changelog?.initialVersionHashes &&
        toolsJson.changelog?.initialVersionHashes?.includes(hash)
      ) {
        tag = toolsJson.changelog.initialVersion;
      } else {
        tag = semver.inc(packageJson.version, 'patch') + '-unreleased';
      }
    }
    return tag;
  };

  /**
   * Checks if a commit message starts with one of the allowed prefixes.
   * @param message The commit message.
   * @param prefixes The allowed prefixes
   * @returns True if the message starts with an allowed prefix, false otherwise.
   */
  private hasAllowedPrefix = (message: string, prefixes: string[]): boolean => {
    return prefixes.some((prefix) =>
      message.toLowerCase().startsWith(prefix.toLowerCase()),
    );
  };

  /**
   * Checks if a commit message ends with the "(#x)" format.
   * @param message The commit message.
   * @returns True if the message ends with "(#x)" format, false otherwise.
   */
  private hasCommitNumber = (message: string): boolean => {
    const commitRegex = /\(#(\d+)\)$/; // Match "(#x)" where 'x' is a number
    return commitRegex.test(message);
  };

  /**
   * Updates the taggedCommitsMap with a commit for the given tag.
   * @param taggedCommitsMap The object mapping tags to commits.
   * @param tag The tag associated with the commit.
   * @param commit The commit object.
   */
  private updateTaggedCommitsMap = (
    taggedCommitsMap: { [tag: string]: Commit[] },
    tag: string,
    commit: Commit,
  ): void => {
    if (!taggedCommitsMap[tag]) {
      taggedCommitsMap[tag] = [];
    }
    taggedCommitsMap[tag].push(commit);
  };

  /**
   * Converts the taggedCommitsMap into an array of TaggedCommit objects and sorts them by semantic version.
   * @param taggedCommitsMap The object mapping tags to commits.
   * @returns An array of TaggedCommit objects sorted by semantic version.
   */
  private convertTaggedCommitsMapToArray = (taggedCommitsMap: {
    [tag: string]: Commit[];
  }): TaggedCommit[] => {
    const taggedCommits: TaggedCommit[] = [];
    for (const tag in taggedCommitsMap) {
      taggedCommits.push({ tag, commits: taggedCommitsMap[tag] });
    }
    // Sort the taggedCommits array by semantic version
    taggedCommits.sort((a, b) => semver.compare(b.tag, a.tag));
    return taggedCommits;
  };

  /**
   * Retrieves the commits associated with tags based on specific filters.
   * @returns An array of TaggedCommit objects containing the tags and commits.
   */
  private getCommitsWithTags = (): TaggedCommit[] => {
    const packageJson = readPackageJson();
    if (!packageJson) {
      throw new Error('Cannot open package.json');
    }

    const toolsJson = readToolsJson();
    if (!toolsJson) {
      throw new Error('Cannot open tools.json');
    }

    // Get the list of commit hashes
    const commitHashes = execSync('git rev-list --all').toString().split('\n');

    const taggedCommitsMap: { [tag: string]: Commit[] } = {};

    for (const hash of commitHashes) {
      if (!hash) {
        continue;
      }

      const message = this.getCommitMessage(hash);

      if (
        !this.hasAllowedPrefix(
          message,
          toolsJson.changelog?.prefixes || this.defaultAllowedPrefixes,
        ) ||
        this.hasCommitNumber(message)
      ) {
        continue;
      }

      const tag = this.getRecentTag(hash, toolsJson, packageJson);

      if (tag) {
        this.updateTaggedCommitsMap(taggedCommitsMap, tag, { hash, message });
      }
    }

    return this.convertTaggedCommitsMapToArray(taggedCommitsMap);
  };

  /**
   * Generates a changelog file with the given tagged commits.
   * @param taggedCommits An array of TaggedCommit objects.
   * @param filename The name of the changelog file.
   */
  private generateChangelog = (
    taggedCommits: TaggedCommit[],
    filename: string,
  ): void => {
    const header =
      '# Change Log\nAll notable changes to this project will be documented in this file.\n';

    let changelog = header;

    // Iterate over each tagged commit
    taggedCommits.forEach((taggedCommit) => {
      const tag = taggedCommit.tag;
      const commits = taggedCommit.commits;

      // Add the tag as a new version heading
      changelog += `\n## ${tag}\n`.replace('-unreleased', ' Unreleased');

      // Iterate over each commit and add its message to the changelog
      commits.forEach((commit) => {
        changelog += `- ${commit.message}\n`;
      });
    });

    // Write the changelog to the file
    fs.writeFileSync(filename, changelog);
  };
}
