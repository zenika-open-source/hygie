# Customisable Rules

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
