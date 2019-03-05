export class GithubService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGithub');
}
