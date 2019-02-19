# Issue Title Rule

## Goal

This rule's aim is to check if the new issue has a correct title, according to a regular expression.

### YAML file

```yml
- name: issueTitle
  enabled: true
  events:
    - NewIssue
  options:
    regexp: (add|fix)\s.*
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: info
        message: 'correct issue title'
  onError:
    - callback: LoggerRunnable
      args:
        type: warn
        message: 'pattern does not match, issue title must begin with : "add|fix"!'
```

## Customisation

You can override its behaviour by updating the `validate()` method.

Actually, this method simply test if the branch name match the `regexp` and run the `onSuccess` or `onError` callbacks accordingly.

You may want to delete immediatly this new issue, or something else. You just have to write the business rules before the `return` line.
