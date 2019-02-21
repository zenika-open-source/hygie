# Customisable Post-Actions

A Post-Action, is a callback that will be executed after a rule `validate()` method.
This allow you to customise your process, according to the result of a rule.

You can:

- log informations,
- send webhook with data priviously proccessed,
- comment an issue or a PR,
- and much more!

## How does it work?

In your `rules.yml` config file, you can add `callback` functions that will be called if the rule success or fails.

These `callback`s are `Runnable` classes, that implement the `RunnableInterface`.
The `Runnable` will execute the `run()` method with `RuleResult` and `args` as arguments.

[`RuleResult`](../rules/customisableRules.html#validate-method) is an object containing the result of the rule, and `args` is a custom object, with as many properties as you want.

## Create your own Runnable class

If you don't find a suitable Post-Action for your needs, you can easily create yours by implementing the `RunnableInterface`.

Your Runnable class must have a name and implement the `run()` method as said in the previous section.

You actualy need to complete the `getRunnable()` method in `src/runnables/runnable.ts` as follow:

```typescript
  getRunnable(name: string): RunnableInterface {
    let runnable: RunnableInterface;
    switch (name) {
      case 'MyRunnable':
        runnable = new MyRunnable();
        break;
        // ...
    }
  }
```

### Use of services

It you need particular Services, you have to declare them in your constructor.

For example:

```typescript
constructor(private readonly myService: MyService)
```

You also have to add it in the `Runnable` constructor:

```typescript
constructor(
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly myService: MyService,
) {}
```

Finally, you must add the needed service in the module `imports`, and your new `Runnable` in the `exports`:

```typescript
@Module({
  imports: [HttpModule, GitModule, MyService],
  providers: [CommentIssueRunnable, WebhookRunnable],
  exports: [CommentIssueRunnable, WebhookRunnable, MyRunnable],
})
```

### _mustache_ templating

If you want to allow templating (you want to!), you need to use the `render()` method provide by _mustache_.

Just have a look at the `LoggerRunnable` implementation:

```typescript
run(ruleResult: RuleResult, args: LoggerArgs): void {
    switch (args.type) {
        case 'info':
            logger.info(render(args.message, ruleResult));
        break;
        case 'warn':
            logger.warn(render(args.message, ruleResult));
        break;
    }
}
```

The `render()` method need the string containing the template (in the `args` object), and the data provider: `RuleResult` which is the return by the [`validate()` rule method](../rules/customisableRules.html#validate-method).
