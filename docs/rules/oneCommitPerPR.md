# One Commit Per PR Rule

## Goal

This rule's aim is to check if the PR/MR respect the 'one commit only' good practice.

## Return value

The `IssueTitleRule` `validate()` method return the following `RuleResult` object:

```typescript
{
  validated: boolean;
  data: {
    commits: WebhookCommit[]
  }
}
```

You can use it in your `callback`s `args` (see the [templating section](customisableRules.html#templating-with-mustache)).

Check out the [type/class/enum section]() to have a look on the `WebhookCommit` class.

## Usage

```yaml
  - name: oneCommitPerPR
    enabled: true
    events:
      - Push
    onSuccess:
      - callback: LoggerRunnable
        args:
          type: info
          message: 'there is only on commit in this PR/MR/Push, ok'
    onError:
      - callback : WebhookRunnable
        args:
          url: 'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8'
          data: {
            user: 'bastien terrier',
            content: 'More than one commmit !',
			commits: '{{#data.commits}}
				{{message}} (#{{id}})
			{{/data.commits}}
			',
          }
          config: {
            headers: {
              Authorization: 'token 1234567890abcdef'
            }
          }
```

## Customisation

You can override its behaviour by updating the `validate()` method.
