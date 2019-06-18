# Register CRON jobs

## `cron-*.rulesrc` file

CRON jobs files are rules files. Therefore, there are identical to the `.rulesrc` file and can be generate thank's to our [config generator](configGenerator.md).

But be carefull, your `rules` will be executed periodically. There is no Webhook thrown.
Consequently, only rules with `Cron` event are allowed inside your rule file.

Check-out [all the available rules](../rules/existingRules.md) marked by
::: tip
Available in CRON jobs
:::

## Registration

As said in the [Getting Started section](gettingStarted.md), you have to put all your CRON files in your `.hygie` folder.

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
  "filename": ["cron-1.rulesrc", "cron-2.rulesrc", "cron-3.rulesrc"],
  "projectURL": "https://github.com/DX-DeveloperExperience/hygie",
  "expression": "0 0 8-20/1 * * *"
}
```

3 files but with different CRON expression.

```json
[
  {
    "filename": ["cron-1.rulesrc"],
    "projectURL": "https://github.com/DX-DeveloperExperience/hygie",
    "expression": "0 0 8-20/1 * * *"
  },
  {
    "filename": ["cron-2.rulesrc"],
    "projectURL": "https://github.com/DX-DeveloperExperience/hygie",
    "expression": "0 0 8-20/2 * * *"
  },
  {
    "filename": ["cron-2.rulesrc"],
    "projectURL": "https://github.com/DX-DeveloperExperience/hygie",
    "expression": "0 0 8-20/3 * * *"
  }
]
```
