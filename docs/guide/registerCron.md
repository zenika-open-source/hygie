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

Everytime you're creating / updating / deleting a cron file into that directory, it will create / update / delete the cron job automatically.

A cron file is a classical `.rulesrc` file, but with an optional option : the cron expression `cron`, which default value is `0 0 6-20/1 * * *`. That means, every hour from 6am to 8pm every day.

::: warning
Cron jobs cannot be processed more than 1 time per hour.
:::

::: tip
You can use [https://cronexpressiondescriptor.azurewebsites.net](https://cronexpressiondescriptor.azurewebsites.net) to generate your CRON expression.
:::
