# Environment Variables

If you wanna use Environment Variables in your callback's argument, like an API key or anything else, you need to follow the next steps.

## Create a `hygie-env` repo

First of all, you need to create a **PRIVATE** `hygie-env` git repository in the same organization of your repo(s) using `Hygie`.

For example, if you have the following git repositories using our solution:

- /user/project1
- /user/project2
- /organization/project1
- /organisation/project2

You need to create the two following repositories:

- /user/hygie-env
- /organisation/hygie-env

::: warning
Make sure your repo is **PRIVATE** because it will contain all the secrets you want to share with `Hygie` app.
:::

## Add a webhook

Then, add a webhook with the url: `--OUR_URL--/env-var` with the `push` event.

::: tip
When you will commit your changes, we will be noticed and save your data **encoded**.
:::

## Add an `env.yml` file

Finally, you need to create an `env.yml` file that follow the syntax:

```yaml
projects:
  - name: project1
    envs:
      API_KEY: 'yourapikey'
      REGEXP: '^.*$'
  - name: project2
    envs:
      API_KEY: 'anotherapikey'
  - name: project3
    envs:
      EMAIL_ADDRESS: 'your@email.address'
```

With the same file, you're able to configure all the projects using `Hygie`.
