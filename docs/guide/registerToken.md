# Register your Application

This API allows you to interact with Github or Gitlab repositories. You can update commit status, add comments on issues or Pull Request/ Merge Request, etc.

In order to do it, we need a _token_.

::: warning
Theses informations will be stored in our server and will be accessible **only** by us.
:::

Go to the [Github](#github) or [Gitlab](#gitlab) section following your needs.

Once the corresponding form will be filled, a `Connected to Hygie!` issue will be created in your repository.
If not, please check the provided token.

## Github

The easiest way to include our solution if you're using Github, is to use our OAuth App.
Just fill your project's url and click the `registration` link.

This will open a new tab and ask you to login with Github.

::: warning
This could take a few seconds, please wait.
:::

<RegisterToken git="Github"/>

#### Other solution

If you don't want to use the previous solution, you can generate yourself your _token_.
Navigate to [https://github.com/settings/tokens](https://github.com/settings/tokens) to generate a new token. You just need to fill the `token description` field and give it the `repo` and `admin:repo_hook` scopes.

Then, complete the [Gitlab form](#gitlab) with your Github repository and token.

#### Self hosted Github server

::: warning
If your project is hosted on a personal/enterprise server, you need to fill the [Gitlab form](#gitlab). Indeed, the `API URL` is not the same and need to be set manually.
:::

## Gitlab

First, generate a personal token: go to [https://gitlab.com/profile/personal_access_tokens](https://gitlab.com/profile/personal_access_tokens) and fill the `name` field with the name of your token, choose an expiration date and give it the `api` scope.

Then, fill the following form:

<RegisterToken git="Gitlab"/>
