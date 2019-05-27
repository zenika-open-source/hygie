# All existing rules

This section describes each existing rules: what's its goal and the `ruleResult` object returned by the `validate()` method that can be use for templating.

[[toc]]

## BranchNameRule

### Goal

Checks the branch's name according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    branch: string,
    branchSplit: string[]
  }
}
```

### Usage

```yaml
- name: branchName
  options:
    regexp: '^(fix|feature)/.*'
  onError:
    - callback: DeleteBranchRunnable #CAUTION!
    - callback: LoggerRunnable
      args:
        message: 'Branch {{data.branch}} has been deleted because it does not begin with fix or feature.'
  onSuccess:
    - callback: CreatePullRequestRunnable
      args:
        title: 'WIP: {{data.branch}}'
        description: 'Work in Progress Pull Request'
```

## CheckAddedFilesRule

### Goal

Checks all added filenames in commits according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    addedFiles: string[]
  }
}
```

### Usage

```yaml
- name: checkAddedFiles
  options:
    regexp: '*.exe$'
  onSuccess:
    - callback: DeleteFilesRunnable
      args:
        message: 'removing .exe file'
```

## CheckIssuesRule

### Goal

Return all Issues matching the filters options.

::: tip
Available in CRON jobs
:::

### Options

- `updatedWithinXDays`: number
- `notUpdatedSinceXDays`: number
- `state`: open|close|all

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    issueNumber: number[]
  }
}
```

### Usage

```yaml
- name: checkIssues
  options:
    state: open
    notUpdatedSinceXDays: 7
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: warn
        message: '{{data.issueNumber.length}} deserted Issue(s) founded. They will be closed. '
    - callback: UpdateIssueRunnable
      args:
        state: close
  onError:
    - callback: LoggerRunnable
      args:
        type: info
        message: 'No deserted Issue founded.'
```

## CheckPullRequestsRule

### Goal

Return all Pull Requests matching the filters options

::: tip
Available in CRON jobs
:::

### Options

- `updatedWithinXDays`: number
- `notUpdatedSinceXDays`: number
- `state`: open|close|all

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    pullRequestNumber: number[]
  }
}
```

### Usage

```yaml
- name: checkPullRequests
  options:
    state: open
    notUpdatedSinceXDays: 7
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: warn
        message: '{{data.pullRequestNumber.length}} deserted Pull Request(s) founded. They will be closed.'
    - callback: UpdatePullRequestRunnable
      args:
        state: close
  onError:
    - callback: LoggerRunnable
      args:
        type: info
        message: 'No deserted Pull Request founded.'
```

## CheckPullRequestStatusRule

### Goal

Checks if the Pull Request event matchs.

### Options

- `state`: new|merged|closed|reopened

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    pullRequestEvent: GitEvent,
    pullRequestTitle: string,
    pullRequestNumber: number,
    pullRequestDescription: string
  }
}
```

### Usage

```yaml
- name: checkPullRequestStatus
  options:
    status: reopened
  onSuccess:
    - callback: SendEmailRunnable
      args:
        to: bastien.terrier@gmail.com
        subject: 'Pull Request #{{data.pullRequestNumber}} reopened '
        message: '<b>{{data.pullRequestTitle}}</b> has been reopened, please pay attention!'
```

## CheckVulnerabilitiesRule

### Goal

Checks if `package.json` and `package-lock.json` contain vulnerabilities thank's to `npm audit`.

::: tip
Available in CRON jobs
:::

### Options

- `packageUrl`: url of your RAW package.json file
- `packageLockUrl`: url of your RAW package-lock.json file

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    vulnerabilities: object[]
  }
}
```

### Usage

```yaml
- name: checkVulnerabilities
  onSuccess:
    - callback: LoggerRunnable
      args:
        message: 'No vulnerability founded!'
  onError:
    - callback: LoggerRunnable
      args:
        message: '{{data.number}} vulnerabilities founded!'
    - callback: WebhookRunnable
      args:
        url: 'https://webhook.site/0123-4567-89ab-cdef'
        data: {
          user: 'cron bot',
          number: '{{data.number}}',
          vulnerabilities: '{{{data.vulnerabilities}}}'
        }
```

`vulnerabilities` contains all vulnerabilities returned by `npm audit` in JSON format.

## CommitMessageRule

### Goal

Checks all commits title according to a regular expression and an optional max size.

### Options

- `regexp`: string
- `maxLength`: number
- `branches`:

```
only: string[];
ignore: string[]
```

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    branch: string,
    commits: {
      sha: string,
      message: string,
      matches: string[]
    }[],
  }
}
```

### Usage

```yaml
- name: commitMessage
  options:
    regexp: '^(feat|fix|docs)(\([a-z]+\))?:\s[^(]*(\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\))?$'
    maxLength: 50
    branches:
      ignore:
        - gh-pages
        - features
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
```

## IssueCommentRule

### Goal

Checks the new issue's comment according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    issueTitle: string,
    issueNumber: number
    commentId: number,
    commentDescription: string
  }
}
```

### Usage

```yaml
- name: issueComment
  options:
    regexp: '^ping @bastienterrier$'
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: warn
        message: 'Someone ping you!'
```

## IssueTitleRule

### Goal

Checks the issue's title according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    issueTitle: string,
    issueNumber: number
  }
}
```

### Usage

```yaml
- name: issueTitle
  options:
    regexp: '(fix|Fix)\s.*'
  onSuccess:
    - callback: SendEmailRunnable
      args:
        to: bastien.terrier@gmail.com
        subject: 'New issue (#{{data.issueNumber}}) '
        message: '<b>{{data.issueTitle}}</b> has been created!'
```

## OneCommitPerPRRule

### Goal

Checks if there is only one commit in the current PR, MR or Push.

### Options

None.

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    branch: string,
    commits: {
      sha: string,
      message: string
    }[]
  }
}
```

### Usage

```yaml
- name: oneCommitPerPR
  onError:
    - callback: LoggerRunnable
      args:
        message: 'more than one commit! A notification will be sent to the maintainer.'
    - callback : WebhookRunnable
      args:
        url: 'https://webhook.site/0123-4567-89ab-cdef'
        data: {
          user: 'bot',
          content: 'More than one commmit !',
          commits: '{{#data.commits}}
                      {{message}} (#{{id}})
                    {{/data.commits}}',
        }
```

## PullRequestCommentRule

### Goal

Checks the new PR or MR's comment according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolea,
  data: {
    pullRequestTitle: string,
    pullRequestNumber: number,
    pullRequestDescription: string,
    commentId: number,
    commentDescription: string
  }
}
```

### Usage

```yaml
- name: pullRequestComment
  options:
    regexp: '^ping @bastienterrier$'
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: warn
        message: 'Someone ping you!'
```

## PullRequestTitleRule

### Goal

Checks the PR or MR's title according to a regular expression.

### Options

- `regexp`: string

### `ruleResult` object

```typescript
{
  validated: boolea,
  data: {
    pullRequestTitle: string,
    pullRequestNumber: number,
    pullRequestDescription: string
  }
}
```

### Usage

```yaml
- name: pullRequestTitle
  options:
    regexp: '^(WIP|FIX)\s:.*'
  onError:
    - callback: CommentPullRequestRunnable
      args:
        comment: 'ping @bastienterrier'
```
