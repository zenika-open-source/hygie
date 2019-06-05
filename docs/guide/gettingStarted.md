# Getting Started

## Directory structure

If you want to use the `Git Webhooks` API, you need to create a `.git-webhooks` folder in your root directory.

This folder will be fetched everytime you interact with our API.

```
.
├── .git-webhooks
│  ├── .rulesrc
│  └── cron-*.rulesrc
└── package.json
```

It contains the following files:

- `.git-webhooks/rulesrc`: all the rules and post-actions you configured (see the [config generator](configGenerator.md)),
- `.git-webhooks/cron-*.rulesrc`: all rules that will be evaluated in a cron job. Same as the `rulesrc` file, check out our [config generator](configGenerator.md). `*` is a wildcard; eg: `cron-vulnerabilities.rulesrc` or `cron-1.rulesrc`.
  ::: tip
  You can create as many Cron files as you want.
  :::

## Repository registration

You also need to [register your repository](registerToken.md) in our server.

::: warning
If you don't register your credentials, you will not be able to interact with your git repository (ie. create comment, update commit status, etc.).
:::

## Running the project

If you want to run this project, you have different choices :

- [turnkey solutions](#turnkey-solutions)
  - [directly use our public API](#from-our-public-api)
  - [running directly one of ours docker images](#run-our-docker-image-from-dockerhub)
- [clone and extend it](#clone-and-extend-it)
  - [launch it via CLI](#from-our-github-repository)
  - [create your own docker container](#build-your-own-docker-image)

## Turnkey solutions

::: warning
With these turnkey solutions, you can't create your custom rules, to do that, check the next section.
:::

### From our public API

The easiest solution is to use directly our public API to getting started and discover our solution.

Our API is currently running at : [--OUR_URL--](--OUR_URL--).

### Run our Docker image from DockerHub

If you just want to test our project, without cloning it, you can run a container with one of the existing versions in [DockerHub](https://hub.docker.com/r/dxdeveloperexperience/git-webhooks).

You can simply run a container:

```
docker run --name=webhook-container -v webhook-vol:/app -p 3000:3000 dxdeveloperexperience/git-webhooks:--DOCKER_TAG--
```

## Clone and extend it

Cloning this project allows you to extend it and create custom rules and runnables.

::: tip
If you create rules or post-actions that can be usefull for others, please ask for a PR!
:::

### From our Github repository

First, clone our project and go to the root directory:

```
git clone https://github.com/DX-DeveloperExperience/git-webhooks
cd git-webhooks
```

Then, simply run :

```
npm install
npm run start
```

The application is now running at [localhost:3000](localhost:3000)

To check if everything's alright, you should get a welcome message.

### Build your own Docker image

You can create a docker image of our **_Git Webhooks_** API.

First, clone our project and go to the root directory :

```
git clone https://github.com/DX-DeveloperExperience/git-webhooks
cd git-webhooks
```

Then, build it:

```
docker build -t my-webhook .
```

::: tip
This will execute the `Dockerfile` config file.
:::

Finally, you can run the Docker image:

```
docker run --name webhook-container -d -p 3000:3000 my-webhook
```

## Github/Gitlab webhook configuration

Once the API is running, you can add a webhook to your git repository with the url : `--OUR_URL--/webhook`. You can also select the events you want to receive, or select all of them.

::: tip
You can use [ngrok](https://ngrok.com/) to convert localhost url to public url.
:::

### Github

You can add as many webhooks as you want. Just go to your repository settings: `https://github.com/:owner/:repo/settings/hooks`, add click the `Add webhook` button.

Now you can :

- configure the `Payload URL`,
- check if `Content type` is set to `application/json`,
- select the `send me everything` option,
- save this configuration.

### Gitlab

Go to your repository integrations settings: `https://gitlab.com/:owner/:repo/settings/integrations`, configure the webhook URL and select all the events you want to intercept. Finally, save it via the `Add webhook` button.

## Google API

The `SendEmailRunnable` makes use of Google API to send mails.

### Through our API

If you're using **Git Webhooks** through our API, you do not have any configuration to do.
::: warning
But be aware, emails will be sent as **dx.developer.experience@gmail.com**.
:::

### In your own server

If you want to use your own account, you have to deploy the project in your server.
You need to create the `crendentials.json` file as described [in the offical documentation](https://developers.google.com/gmail/api/quickstart/nodejs).

You just have to follow `Step 1` to get your credentials.

::: warning
The chosen account will be the sender (email `from` field) of all emails sended through the `SendEmailRunnable`.
:::

## Others config

If you're using your own server to host our solution, there's a few Environment Variables you can set:

- `ALLOW_REMOTE_CONFIG`: true|false _[optional]_
  > Specify if you allow to fetch the `.git-wehbooks/.rulesrc` file from the received hook. Otherwise, it uses the local `src/rules/.rulesrc`.
- `DATA_ACCESS`: "file" | undefined _[optional]_
  > Specify the way you're accessing your data. By default, the app is fetching your mongo database.
  > If you choose "file", it will store(and fetch) all users configurations into files.

::: tip
Setting Environment Variables:

- Windows: `$env:DATA_ACCESS="file"`
- Linux: `export DATA_ACCESS=file`

:::
