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
They are in this `rules.yml` file, located in `src/rules/rules.yml` and must respect the `Rule` class (`src/rules/rule.class.ts`).

Example:

```yml
- name: commitMessage
  enabled: true
  events:
    - Push
  options:
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

If you want to create a new type of rule, you must create your own class. It must extend the abstract `Rule` class, and implement the `valide()` function. This function contains all your business logic.

You can have a look at the `CommitMessageRule.ts` class located in `src/rules`.
