# Getting Started

## Running the project

If you want to run this project, you have different choices :

- [cloning it and launch it via CLI](#from-npm-cli)
- [cloning it and create your own docker container](#build-your-own-docker-image)
- [running directly one of ours docker images](#run-our-docker-image-from-dockerhub)

### From npm CLI

First, clone our project and go to the root directory :

```
git clone https://github.com/DX-DeveloperExperience/git-webhooks
cd git-webhooks
```

Then, simply run :

```
npm run start
```

The application is now running at [localhost:3000](localhost:3000)

You can check if everything's alright, you sould get a welcome message.

### Build your own Docker image

You can create a docker image of our **_Git Webhooks_** Project.

First, clone our project and go to the root directory :

```
git clone https://github.com/DX-DeveloperExperience/git-webhooks
cd git-webhooks
```

Then run :

```
docker build -t my-webhook .
```

::: tip
This will execute the `Dockerfile` config file.
:::

Then, you can simply run a container :

```
docker run --name webhook-container -d -p 3000:3000 my-webhook:latest
```

### Run our Docker image from DockerHub

If you just want to test our project, without cloning it, you can run a container with one of the existing versions in [DockerHub]().

```
docker run --name webhook-container -d -p 3000:3000 dxdeveloperexperience/git-webhooks:TAG
```

## Github/Gitlab configuration

### Add a webhook

Once the API is running, you can configure create a webhook to your git repository with the url : `http://<url of your server>/webhook`. You can also select the events you want to receive, or select all of them.

::: tip
You can use [ngrok](https://ngrok.com/) to convert localhost url to public url.
:::

#### Github

You can add as many webhooks as you want. Just go to your repository settings: `https://github.com/:owner/:repo/settings/hooks`, add click the `Add webhook` button.

Now you can :

- configure the `Payload URL`,
- check if `Content type` is set to `application/json`,
- select the `send me everything` option,
- save this configuration.

#### Gitlab

Go to your repository integrations settings: `https://gitlab.com/:owner/:repo/settings/integrations`, configure the webhook URL and select all the events you want to intercept. Finally, save it via the `Add webhook` button.

### Add token access

This project allows you to interact with Github and Gitlab repositories. You can update commit status, add comments on issues or Pull Request/ Merge Request, etc.

In order to do it, you have to get a _token_ of the repo you interact with.

#### Github

Navigate to [https://github.com/settings/tokens](https://github.com/settings/tokens) to generate a new token. You just need to fill the `token description` field and give it the `repo` scope.

#### Gitlab

Go to [https://gitlab.com/profile/personal_access_tokens](https://gitlab.com/profile/personal_access_tokens) and fill the `name` field with the name of your token, choose an expiration date and give it the `api` scope.

### Create the `config.env` file

Once you get your token, create a `config.env` file at your root's project and add the following lines:

```
GITHUB_TOKEN=your_github_token
GITLAB_TOKEN=your_gitlab_token
GITHUB_API=https://api.github.com
GITLAB_API=https://gitlab.com/api/v4
```

If your project is hosted on an official github or gitlab repository, you can leave the GITHUB_API and GITLAB_API as default. But, if you are using another host, you have to adapt the API URL.

## Google API

The `SendEmailRunnable` makes use of Google API to send mails.

If you want to use it, you need to create the `crendentials.json` file as describe [in the offical documentation](https://developers.google.com/gmail/api/quickstart/nodejs).

You just have to follow `Step 1` to get your credentials.

::: warning
The chosen account will be the sender (email `from` field) of all emails sended through the `SendEmailRunnable`.
:::

## Testing the project

### GitLab local instance

You can install GitLab Community Edition for testing purposes.

First, install **Docker**.

Second, create a docker volume for persistent data : `docker volume create vol-gitlab`.

Then, you can simply run :

```
docker run --detach \
	--hostname gitlab.example.com \
	--publish 443:443 --publish 80:80 --publish 22:22 \
	--name gitlab \
	--mount source=vol-gitlab,target=/app \
	--restart always \
	--volume /srv/gitlab/config:/etc/gitlab \
	--volume /srv/gitlab/logs:/var/log/gitlab \
	--volume /srv/gitlab/data:/var/opt/gitlab \
	gitlab/gitlab-ce:latest
```

Or, for Windows PowerShell : `docker run --detach --hostname gitlab.example.com --publish 443:443 --publish 80:80 --publish 22:22 --name gitlab --mount source=vol-gitlab,target=/app --restart always --volume /srv/gitlab/config:/etc/gitlab --volume /srv/gitlab/logs:/var/log/gitlab --volume /srv/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce:latest`

::: warning
Do not use Windows PowerShell ISE
:::
