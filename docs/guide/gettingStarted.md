# Getting Started

## GitLab local instance

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

> **Tip :** do not use Windows PowerShell ISE

## Docker instance

You can create a docker image of our Webhook Project running this script :

```
docker build -t my-webhook .
```

Then, you can simply run a container :

```
docker run --name webhook-container -d -p 3000:3000 my-webhook:latest
```

Finally, you can configure the webhook attachs to your git repository with the url : `http://localhost:3000/webhook`.

> **Tip :** you can use [ngrok](https://ngrok.com/) to convert localhost url to public url.
