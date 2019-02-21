# Issue Title Rule

## Goal

This rule's aim is to check if the new issue has a correct title, according to a regular expression.

## Return value

The `IssueTitleRule` `validate()` method return the following `RuleResult` object:

```typescript
{
  validated: boolean;
  data: {
    issueTitle: string,
    git: GitTypeEnum,
    issueNumber: number,
    gitApiInfos: GitApiInfos,
  }
}
```

You can use it in your `callback`s `args` (see the [templating section](customisableRules.html#templating-with-mustache)).

## Usage

```yaml
- name: issueTitle
  enabled: true
  events:
    - NewIssue
  options:
    regexp: (add|fix)\s.*
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: info
        message: '{{data.issueTitle}} is correct issue title'
  onError:
    - callback: LoggerRunnable
      args:
        type: warn
        message: '{{data.issueTitle}} is not a correct issue title'
    - callback: CommentIssueRunnable
      args:
        comment: 'ping @bastienterrier'
```

## Customisation

You can override its behaviour by updating the `validate()` method.

Actually, this method simply test if the issue title match the `regexp`.

You may want to delete immediatly this new issue, or something else. You just have to write the business rules before the `return` line.
