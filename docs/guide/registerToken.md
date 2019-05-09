# Register your Credentials

## Obtain an access token

This API allows you to interact with Github and Gitlab repositories. You can update commit status, add comments on issues or Pull Request/ Merge Request, etc.

In order to do it, you have to get a _token_ of the repo you interact with.

::: warning
Theses informations will be stored in our server and will be accessible **only** by us.
:::

### Github

Navigate to [https://github.com/settings/tokens](https://github.com/settings/tokens) to generate a new token. You just need to fill the `token description` field and give it the `repo` scope.

### Gitlab

Go to [https://gitlab.com/profile/personal_access_tokens](https://gitlab.com/profile/personal_access_tokens) and fill the `name` field with the name of your token, choose an expiration date and give it the `api` scope.

## Registration

Once the following form will be filled, a `Connected to Git-Webhooks!` issue will be created in your repository.
If not, please check the provided token.

<RegisterToken/>

::: tip
If your Github or Gitlab repo is hosted in the official website, the Git API URL are the following:

- Github: https://api.github.com
- Gitlab: https://gitlab.com/api/v4

:::

::: warning
Do not forget to change it if your repo is hosted on another server!
:::
