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

> This will execute the `Dockerfile` config file.

Then, you can simply run a container :

```
docker run --name webhook-container -d -p 3000:3000 my-webhook:latest
```

### Run our Docker image from DockerHub

If you just want to test our project, without cloning it, you can run a container with one of the existing versions in [DockerHub]().

```
docker run --name webhook-container -d -p 3000:3000 REPO/my-webhook:VERSION
```

---

Once the application is running, you can configure the webhook attachs to your git repository with the url : `http://localhost:3000/webhook`.

> You can use [ngrok](https://ngrok.com/) to convert localhost url to public url.

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

> **Warning :** do not use Windows PowerShell ISE
