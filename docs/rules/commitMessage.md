# Commit Message Rule

## Goal

This rule's aim is to check if the new commit has a correct name, according to a regular expression. If the name match the `regexp`, the commit will success (`success` status), otherwise it will fail (`error` status).

## Return value

The `CommitMessageRule` `validate()` method return the following `RuleResult` object:

```typescript
{
  validated: boolean;
  data:
  [
    {
      sha: string;
      message: string;
      matches: string[];
    },
    ...
  ]
}
```

You can use it in your `callback`s `args` (see the [templating section](customisableRules.html#templating-with-mustache)).

## Usage

```yaml
  - name: commitMessage
    enabled: true
    events:
      - Push
    options:
      regexp: '(feat|fix|docs)(\([a-z]+\))?:\s[^(]*(\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\))?$'
    onSuccess:
      - callback : WebhookRunnable
        args:
          url: 'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8'
          data: {
            user: 'bastien terrier',
            content: '{{#data}}{{sha}} =
            Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
            {{/data}}'
          }
          config: {}
    onError:
      - callback: LoggerRunnable
        args:
          type: warn
          message: 'pattern does not match, commit name must begin with : "feat|fix|docs"! Check your commit message:
            {{#data}}
              > {{message}} (#{{sha}})
            {{/data}}
          '
```

## Customisation

You can override its behaviour by updating the `validate()` method.

You just have to write the business rules before the `return` line.
