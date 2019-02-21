# Comment Issue Runnable

The `CommentIssueRunnable` Post-Action write a comment on a specific issue.

> It should only get called as `callback` in the `IssueTitleRule`, or in custom rule that return similar `RuleResult`.

## Usage

This Post-Action only need a string message. It's a string that can contain _mustache_ templating.

To use the `CommentIssueRunnable`, add the `callback` on your `rules.yml` config file.

```yaml
- name: issueTitle
  # ...
  onError:
    - callback: CommentIssueRunnable
      args:
        comment: 'ping @bastienterrier'
```
