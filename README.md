# git-webhooks

## Getting Started

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

> **Note :** do not use Windows PowerShell ISE

### Customisable Rules

You can customise the existing rules, by adding yours. Rules are quiet simply to extend.
They are in this `rules.yml` file, located in `src/rules/rules.yml` and must respect the `Rule` class (`src/rules/rules.ts`).

Example:

```yml
- name: Check last commit message on push
    event: Push
    field: commit.message
    regexp: (feat|fix|docs)\(?[a-z]*\)?:\s.*
    onSuccess:
      - callback: logger.info
        args:
          - 'pattern match'
          - 'good game'
      - callback: logger.info
        args:
          - 'another action is being executed'
          - 'commit will successed'
    onError:
      - callback: logger.warn
        args:
          - 'pattern does not match'
          - 'commit name must begin with : "feat|fix|docs"!'
      - callback: logger.warn
        args:
          - 'another action is being executed'
          - 'commit will fail'
```

A rule is use everytime an `event` (Push, NewBranch, Issue, etc) is received. A `regexp` is apply on the specified `filed` (commit message, branch name, etc) and depending on the result, the `onSuccess` or `onError` callbacks are called.

You can add as many onSuccess/onError callback functions, with as many arguments as you want.

For each new callback function you created, you have to complete the `callFunction()` function in `src/rules/rules.ts` file.
