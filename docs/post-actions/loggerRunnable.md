# Logger Runnable

The `LoggerRunnable` Post-Action, like its name suggest, log informations, using [winston logger](https://github.com/winstonjs/winston).

## Usage

This Post-Action need two args:

- type: info|warn (you can extend it depending on your needs),
- message: a string that can contain _mustache_ templating.

To use the `LoggerRunnable`, simply add the `callback` on your `rules.yml` config file.

```yaml
- name: issueTitle
  # ...
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: info
        message: '{{data.issueTitle}} is correct issue title'
  onError:
    - callback: LoggerRunnable
      args:
        type: warn
        message: '{{data.issueTitle}} is not a correct issue title'
```
