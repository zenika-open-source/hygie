// Elle ne servira à rien, lorsque nos runnable pour beneficier de l'injection de deps
export class MockHttpService {}

export class MockGitlabService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGitlab');
}

export class MockGithubService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGithub');
}
