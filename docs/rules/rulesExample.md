# `.rulesrc` example

```yaml
--- # Rules config file

options:
  executeAllRules: true
  enableRules: true
  enableGroups: false
  allRuleResultInOne: false

rules:

  # BRANCH
  - name: branchName
    options:
      regexp: '^(fix|feature)/.*'
    onError:
      - callback: LoggerRunnable
        args:
          message: 'Branch {{data.branchBranch}} does not begin with fix or feature.'
    onSuccess:
      - callback: CreatePullRequestRunnable
        args:
          title: 'WIP: {{data.branchBranch}}'
          description: 'Work in Progress Pull Request'

  # PULL REQUESTS
  - name: pullRequestTitle
    options:
      regexp: '^(WIP|FIX)\s:.*'
    onError:
      - callback: CommentPullRequestRunnable
        args:
          comment: 'ping @bastienterrier'
  - name: checkPullRequestStatus
    options:
      status: reopened
    onSuccess:
      - callback: SendEmailRunnable
        args:
          to: bastien.terrier@gmail.com
          subject: 'Pull Request #{{data.pullRequest.umber}} reopened '
          message: '<b>{{data.pullRequest.title}}</b> has been reopened, please pay attention!'
  - name: pullRequestComment
    options:
      regexp: '^ping @bastienterrier$'
    onSuccess:
      - callback: LoggerRunnable
        args:
          type: warn
          message: 'Someone ping you!'

  # COMMITS
  - name: commitMessage
    options:
      regexp: '^(feat|fix|docs)(\([a-z]+\))?:\s[^(]*(\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\))?$'
      maxLength: 50
    onSuccess:
      - callback : WebhookRunnable
        args:
          url: 'https://webhook.site/0123-4567-89ab-cdef'
          data: {
            user: 'bot',
            content: '{{#data.commits}}{{sha}} =
            Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
            {{/data.commits}}'
          }
    onError:
      - callback: LoggerRunnable
        args:
          message: 'Caution, commit(s): {{#data.commits}}{{sha}},{{/data.commits}} do not respect Good Practices!'
    onBoth:
      - callback: UpdateCommitStatusRunnable
        args:
          failTargetUrl: 'https://gist.github.com/stephenparish/9941e89d80e2bc58a153#examples'
          successDescriptionMessage: 'Commit message matches the Good Practices!'
          failDescriptionMessage: 'Caution, your commit message do not matches the Good Practices!'
  - name: checkAddedFiles
    options:
      regexp: '.*\.exe$'
    onSuccess:
      - callback: DeleteFilesRunnable
        args:
          message: 'removing .exe file'

  #ISSUES
  - name: issueTitle
    options:
      regexp: '(fix|Fix)\s.*'
    onSuccess:
      - callback: SendEmailRunnable
        args:
          to: bastien.terrier@gmail.com
          subject: 'New issue (#{{data.issue.number}}) '
          message: '<b>{{data.issue.title}}</b> has been created!'
  - name: issueComment
    options:
      regexp: '^ping @bastienterrier$'
    onSuccess:
      - callback: LoggerRunnable
        args:
          type: warn
          message: 'Someone ping you!'
```
