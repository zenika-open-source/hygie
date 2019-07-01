# Groups

Groups are powerful options to fit your needs.
When you want to execute severals rules with the same `onSuccess`, `onError` or `onBoth` callbacks, you can group these rules to apply them your callbacks.

Check at the example below:

```yaml
options:
  enableGroups: false
#...
groups:
  #ISSUES
  - groupName: 'Issues Alerts'
    rules:
      - name: issueComment
        options:
          regexp: '.*'
          users:
            ignore:
              - bastienterrier
      - name: issueTitle
        options:
          regexp: '.*'
          users:
            ignore:
              - bastienterrier
    onSuccess:
      - callback: SendEmailRunnable
        args:
          to:
            - bastien.terrier@gmail.com
            - admin@your.website.com
          subject: '[Issue]"{{data.issue.title}}" (#{{data.issue.number}})'
          message: '<b>{{data.issue.title}}</b> has been created/commented!<br>{{data.issue.description}}'
```

The `SendEmailRunnable` callback will be apply when `issueComment` OR `issueTitle` rules succeed.

::: warning
Note that you have to set `enableGroups` option to `true`
:::

## `allRuleResultInOne` option

You can also set the `allRuleResultInOne: true` option.
This option allows you to call the `onSuccess` (and others) callbacks only one time, but with the result of all the processed rules.

Let's have a look at the example below:

```yaml
options:
  enableGroups: false
  allRuleResultInOne: true
#...
groups:
  #ISSUES
  - groupName: 'Issues to Webhook'
    rules:
      - name: commitMessage
        #...
      - name: oneCommitPerPR
      - name: checkAddedFiles
        #...
      - name: checkCronFiles
        #...
    onBoth:
      - callback: WebhookRunnable
        args:
          url: 'https://some.custom.api'
          config: {
            'token': 'your_personal_token'
          }
          data: '{{data}}'
```

It could be very helpful if you want to send data through the `WebhookRunnable`. Imagine you can reach an API only 10 times a day.

In our example, all the previous rules can be fired on Push event. Therefore, when a Push event occurs, if you don't enable the `allRuleResultInOne` option, the callback will be called 4 times. Consequently, you've just lost 3 API calls.

With the option, the API will be called only once with the result of the 4 rules stored into `data`.
