interface GithubCommit {
  message: string;
  id: string;
}

interface GithubPushEvent {
  commits: GithubCommit[];
}

interface GitlabCommit {
  message: string;
  id: string;
}
interface GitlabPushEvent {
  commits: GitlabCommit[];
}
