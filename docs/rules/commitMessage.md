# Commit Message Rule

## Goal

This rule's aim is to check if the new commit has a correct name, according to a regular expression. If the name match the `regexp`, the commit will success (`success` status), otherwise it will fail (`error` status).

According to this status, the `onSuccess` or `onError` callbacks will be called.

### YAML file

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

## Customisation

You can override its behaviour by updating the `validate()` method.

You just have to write the business rules before the `return` line.
