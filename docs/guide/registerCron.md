# Register CRON jobs

## `rules-cron-*.yml` file

CRON jobs files are rules files. Therefore, there are identical to the `rules.yml` file and can be generate thank's to our [config generator](configGenerator.md).

But be carefull, your `rules` will be executed periodically. There is no Webhook thrown.
Consequently, only rules with `Cron` event are allowed inside your rule file.

Check-out [all the available rules](./rules/existingRules.md) marked by
::: tip
Available in CRON jobs
:::

## Registration

As said in the [Getting Started section](gettingStarted.md), you have to put all your CRON files in your `.git-webhooks` folder.

Then, complete your JSON request to register your file(s), as defined in the following schema.

<RegisterCron/>

### Tips

::: tip
`expression` is optional. Default value is `0 0 6-20/1 * * *`.
Which means, every hour from 6am to 8pm every day.
:::

::: tip
You can use [https://cronexpressiondescriptor.azurewebsites.net](https://cronexpressiondescriptor.azurewebsites.net) to generate your CRON expression.
:::

3 files with the same CRON expression.

```json
{
  "filename": ["rules-cron-1.yml", "rules-cron-2.yml", "rules-cron-3.yml"],
  "projectURL": "https://github.com/DX-DeveloperExperience/git-webhooks",
  "expression": "0 0 8-20/1 * * *"
}
```

3 files but with different CRON expression.

```json
[
  {
    "filename": ["rules-cron-1.yml"],
    "projectURL": "https://github.com/DX-DeveloperExperience/git-webhooks",
    "expression": "0 0 8-20/1 * * *"
  },
  {
    "filename": ["rules-cron-2.yml"],
    "projectURL": "https://github.com/DX-DeveloperExperience/git-webhooks",
    "expression": "0 0 8-20/2 * * *"
  },
  {
    "filename": ["rules-cron-3.yml"],
    "projectURL": "https://github.com/DX-DeveloperExperience/git-webhooks",
    "expression": "0 0 8-20/3 * * *"
  }
]
```
