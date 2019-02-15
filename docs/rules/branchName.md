# Branch Name Rule

## Goal

This rule's aim is to check if the new branch has a correct name, according to a regular expression.

### YAML file

```yml
- name: branchName
  enabled: true
  events:
    - NewBranch
  options:
    regexp: (features|fix)\/.*
  onSuccess:
    - callback: logger.info
      args:
        - 'pattern match'
        - 'good game'
  onError:
    - callback: logger.warn
      args:
        - 'pattern does not match'
        - 'branch name must begin with : "features|fix"!'
    - callback: logger.warn
      args:
        - 'another action is being executed'
        - 'branch will be deleted'
```

## Customisation

You can override its behaviour by updating the `validate()` method.

Actually, this method simply test if the branch name match the `regexp` and run the `onSuccess` or `onError` callbacks accordingly.

You may want to delete immediatly this new branch, or something else. You just have to write the business rules before the `return` line.
