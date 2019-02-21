# Customisable Rules

You can customise the existing rules, by adding yours. Rules are quiet simply to extend.
They are in `rules.yml` file, located in `src/rules/rules.yml` and must respect the `Rule` class (`src/rules/rule.class.ts`).

## Rules config file

The `rules.yml` file contains all the rules you've configured.

### Overview

Each rule must respect the following structure :

```yaml
- name: commitMessage
  enabled: true
  events:
    - Push
  options:
    regexp: '(feat|fix|docs)(\([a-z]+\))?:\s[^(]*(\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\))?$'
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: info
        message: 'pattern match:
          {{#data}}{{sha}} =
          Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
          {{/data}}'
    - callback: LoggerRunnable
      args:
        type: info
        message: 'data will be sent to webhook...'
    - callback : WebhookRunnable
      args:
        url: 'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8'
        data: {
          user: 'bastien terrier',
          content: '{{#data}}{{sha}} =
          Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
          {{/data}}'
        }
        config: {

        }
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

### Properties

The following properties are all needed :

- `enabled`: this boolean specify if the current rule will be used.
- `events`: this array contains all events on which the rule will be tested. See the [supported events](../others/events.md).
- `options`: this object regroup all metadata you need to fill your needs. You can add any attribute you want (string, boolean, array, object...), it will be accessible in the `validate()` method.
- `onSuccess`(`onError`): this object is an array of **post-actions** (or callback functions) which will be called if the rule success (fails). The `callback` must be a [Runnable class](../post-actions/). It takes an `args` object as arguments. As the `options`, you can create as many argument as you want.

**Information:** These `callback`s are called sequentially and do not return value (`void` type).

### Templating with _mustache_

Post-actions `args` support templating: **_Git Webhooks_** use [mustache js](https://github.com/janl/mustache.js).

Consequently, you can inject data processed by the `validate()` method of the current rule (`name` attribute). You can see the [`validate()` method section](#validate-method) for more informations.

For example, you can iterate over the `data` array of `CommitMessageRule`, and display the commit's `sha` and the differents groups captured by the `regexp` options.

```
'{{#data}}{{sha}} =
Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
{{/data}}'
```

For more examples, check out the [documentation](https://github.com/janl/mustache.js#templates) provide by mustache.

---

## Create your own rule

If you want to create a new type of rule, you can create your own class. It must extend the abstract `Rule` class, and implement the `valide()` method. This method contains all your business logic.

You can have a look at the `CommitMessageRule.ts` class located in `src/rules`.

### `validate()` method

Each Rule, should have a `validate()` method as follows:

```typescript
export class MyCustomRule extends Rule {
  name = 'customRule';
  // ...

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();

    /**
     * Your process
     *
     * You can call gitApi via `this.webhook.gitService`
     **/

    // Optional
    // If you want to export data for callbacks, accessible with {{data}}
    ruleResult.data = {
      myData: 'this is some data',
      myArray: ['val1', 'val2', 'val3'],
    };
    ruleResult.validated = true | false;
    return ruleResult;
  }
}
```

This method return a `RuleResult` object, containing the `validated` boolean attribute and a `data` object. You can custom this last property, and then, use it in your `callback`s.

#### `rules.yml` sample file

```yaml
  - name: customRule
    enabled: true
    events:
      - Push
    options:
    onSuccess:
      - callback: LoggerRunnable
        args:
          type: info
          message: 'MyData is: {{data.myData}}
          All values in myArray are:
          {{#data.myArray}}
            .
          {{/data.myArray}}'
    onError:
      - callback: LoggerRunnable
        args:
          type: warn
          message: error!
```

### Declare your new rule

When you create a new rule, you need to extends the `getRules()` method, located in `/src/rules/rules.service.ts` and add the following statement :

```typescript
export function getRules(webhook: Webhook): Rule[] {

  // ...

  else if (r.name === 'customRule') {
    rule = new MyCustomRule(webhook);
  }

  // ...

}
```

> This should be fix quickly, but you actually need to do it.
