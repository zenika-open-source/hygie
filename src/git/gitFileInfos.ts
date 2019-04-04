/**
 * Provide all informations needed to interact with a File (get, delete) via a git API
 */
export class GitFileInfos {
  filePath: string;
  fileBranch: string;
  // In case of removal
  commitMessage: string;
}
