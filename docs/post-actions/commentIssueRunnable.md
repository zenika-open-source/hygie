# Comment Issue Runnable

The `CommentIssueRunnable` Post-Action write a comment on a specific issue.

> It should only get called as `callback` in the `IssueTitleRule`, or in a custom rule that return a similar `RuleResult` object.

## Usage

This Post-Action only needs a string message. This string can contain _mustache_ templating.

To use the `CommentIssueRunnable`, add the `callback` on your `rules.yml` config file.

```yaml
- name: issueTitle
  # ...
  onError:
    - callback: CommentIssueRunnable
      args:
        comment: 'ping @bastienterrier'
```
