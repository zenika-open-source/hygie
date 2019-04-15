# All existing rules

This section describes each existing rules: what's its goal and the `ruleResult` object returned by the `validate()` method that can be use for templating.

<TOC :include-level="[2, 2]"/>

## BranchNameRule

### Goal

Checks the branch's name according to a regular expression.

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

## CheckAddedFilesRule

### Goal

Checks all added filenames in commits according to a regular expression.

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    addedFiles: string[]
  }
}
```

## CheckPullRequestStatusRule

### Goal

Checks if the Pull Request event matchs.

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

## CheckVulnerabilitiesRule

### Goal

Checks if `package.json` and `package-lock.json` contain vulnerabilities thank's to `npm audit`.

### `ruleResult` object

```typescript
{
  validated: boolean,
  data: {
    vulnerabilities: object[]
  }
}
```

`vulnerabilities` contains all vulnerabilities returned by `npm audit` in JSON format.

## CommitMessageRule

### Goal

Checks all commits title according to a regular expression and an optional max size.

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

## IssueCommentRule

### Goal

Checks the new issue's comment according to a regular expression.

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

## IssueTitleRule

### Goal

Checks the issue's title according to a regular expression.

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

## OneCommitPerPRRule

### Goal

Checks if there is only one commit in the current PR, MR or Push.

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

## PullRequestCommentRule

### Goal

Checks the new PR or MR's comment according to a regular expression.

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

## PullRequestTitleRule

### Goal

Checks the PR or MR's title according to a regular expression.

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
