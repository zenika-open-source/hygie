# Webhook Runnable

The `WebhookRunnable` Post-Action, send a POST Request to a particular URL.

## Usage

This Post-Action need the following args:

- url: the string url,
- data: the data you want to send (`any` type),
- config: the `AxiosRequestConfig` configuration.

All of these parameters can contain _mustache_ templating.

To use the `WebhookRunnable`, simply add the `callback` on your `rules.yml` config file.

```yaml
- name: oneCommitPerPR
  # ...
  onError:
    - callback : WebhookRunnable
    args:
        url: 'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8'
        data: {
            user: 'bastien terrier',
            content: 'More than one commmit !',
            commits: '{{#data.commits}}
                {{message}} (#{{id}})
            {{/data.commits}}
            ',
            }
        config: {
            headers: {
                Authorization: 'token 1234567890abcdef'
            }
        }
```
