// Elle ne servira à rien, lorsque nos runnable pour beneficier de l'injection de deps
export class MockHttpService {}
// tslint:disable-next-line:max-classes-per-file
export class MockGitlabService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGitlab');
}
// tslint:disable-next-line:max-classes-per-file
export class MockGithubService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGithub');
}
