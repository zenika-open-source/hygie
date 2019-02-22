# Branch Name Rule

## Goal

This rule's aim is to check if the new branch has a correct name, according to a regular expression.

## Return value

The `BranchNameRule` `validate()` method return the following `RuleResult` object:

```typescript
{
  validated: boolean;
  data: {
    branch: string;
  }
}
```

You can use it in your `callback`s `args` (see the [templating section](customisableRules.html#templating-with-mustache)).

## Usage

```yaml
- name: branchName
  enabled: true
  events:
    - NewBranch
  options:
    regexp: (features|fix)\/.*
  onSuccess:
    - callback: LoggerRunnable
      args:
        type: info
        message: '{{data.branch}} is a good name!'
  onError:
    - callback: LoggerRunnable
      args:
        type: warn
        message: 'pattern does not match, branch name must begin with : "features|fix"!'
```

## Customisation

You can override the `BranchNameRule` behaviour by updating the `validate()` method.

Actually, this method simply test if the branch name match the `regexp`.

You may want to delete immediatly this new branch, or something else. You just have to write the business rules before the `return` line.
