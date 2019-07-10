# Customisable Rules

The `.hygie/.rulesrc` file contains all the rules you've configured.
Check our example `.rulesrc` file [here](./rulesExample.md).

You can use our existing rules or adding yours. Rules are very simple to add.
When you create your own rule, it must extends the `Rule` class (`src/rules/rule.class.ts`).

## Rule configuration

### Structure

Each rule must respect the following structure:

```yaml
- name: commitMessage
  enabled: true
  events:
    - MyEvent1
    - MyEventX
  options:
    opt1: val1
    optY: valY
  onSuccess:
    - callback: MyRunnable
      args:
        runnableArg1: runnableVal1
        runnableArgZ: runnableValZ
```

### Properties

The following properties are all needed :

- `enabled`: this boolean specify if the current rule will be used _[optional: default `true`]_.
- `events`: this array contains all events on which the rule will be tested. See the [supported events](../others/events.md). _[optional: default define in each rule]_
  ::: warning
  If you provide a value, it will overwrite defaults values, not append it.
  :::
- `options`: this object regroup all metadata you need to fill your needs. You can add any attribute you want (string, boolean, array, object...), it will be accessible in the `validate()` method.
- `onSuccess`(`onError`, `onBoth`): this object is an array of **post-actions** (or callback functions) which will be called if the rule success (fails or both). The `callback` must be a [Runnable class](../post-actions/). It takes an `args` object as arguments. As the `options`, you can create as many argument as you want.

::: warning
These `callback`s are called sequentially and do not return value (`void` type).
:::

### Templating with _mustache_

Post-actions `args` support templating: **_Hygie_** use [mustache js](https://github.com/janl/mustache.js).

Consequently, you can inject data processed by the `validate()` method of the current rule (`name` attribute). You can see the [`validate()` method section](#validate-method) for more informations.

For example, you can iterate over the `data.commits` array of `CommitMessageRule`, and display the commit's `sha` and the differents groups captured by the `regexp` options.

```
'{{#data.commits}}{{sha}} =
Object: {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}}
{{/data.commits}}'
```

You can also access the environment variables you've configured via the `env` prefix. More informations in the [Enviroment Variable section](./guide/useEnvVar.md).

For examples:

```
callback: WebhookRunnable
args:
  url: 'https://webhook.site/0123-4567-89ab-cdef'
  config: {
    token: '{{env.API_KEY}}'
  }
  data: {
    user: 'cron bot',
    number: '{{data.number}}',
    vulnerabilities: '{{{data.vulnerabilities}}}'
  }
```

For more examples, check out the [documentation](https://github.com/janl/mustache.js#templates) provide by mustache.

## Create your own rule

If you want to create a new type of rule, you can create your own class. This class must extend the abstract `Rule` class, and implement the `validate()` method. This method contains all your business logic.

### CLI

The easiest way to create it is to use our CLI: [hygie-cli](https://github.com/DX-DeveloperExperience/hygie-cli).

Simply run : `npm run generate:rule RULENAME`.

::: warning
You need to have [`@nestjs/cli`](https://github.com/nestjs/nest-cli) install globally. Therefore, run `npm install -g @nestjs/cli`.
:::

This CLI will create your rule file and add everything necessary in the project. You just have to focus on your business logic.

### `validate()` method

Each Rule, have a `validate()` method as follows:

```typescript
@RuleDecorator('myCustom')
export class MyCustomRule extends Rule {
  // ...

  validate(webhook: Webhook, ruleConfig: PullRequestTitleRule): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

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
