# All existing runnables

This section describes each existing runnables: what's its goal and how to use it.

[[toc]]

## CommentIssueRunnable

### Goal

`CommentIssueRunnable` comments the Issue processed by the previous rule.

::: warning
Be sure that the rule returned the `issueNumber` property in the `RuleResult` object.
:::

### Usage

This Post-Action only needs a string message. This string can contain _handlebars_ templating.

To use the `CommentIssueRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: CommentIssueRunnable
    args:
      comment: 'ping @bastienterrier'
```

## CommentPullRequestRunnable

### Goal

`CommentPullRequestRunnable` comments the PR or MR processed by the previous rule.

::: warning
Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
:::

### Usage

This Post-Action only needs a string message. This string can contain _handlebars_ templating.

To use the `CommentPullRequestRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: CommentPullRequestRunnable
    args:
      comment: 'ping @bastienterrier'
```

## CreateIssueRunnable

### Goal

`CreateIssueRunnable` create an issue with the specified `CreateIssueArgs` params.

### Usage

This Post-Action need the following args:

- `title`: the title of your issue,
- `description`: the description _[optional]_,
- `assignees`: an array of users _[optional]_,
- `labels`: an array of labels _[optional]_,

To use the `CreateIssueRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: CreateIssueRunnable
    args:
      title: 'Add a README'
      description: 'We should create a README.md file to provide project's description to our users.'
```

## CreatePullRequestRunnable

### Goal

`CreatePullRequestRunnable` creates a new PR or MR.

### Usage

This Post-Action need the following args:

- `title`: the title of your PR/MR,
- `description`: the description _[optional]_,
- `source`: the source branch _[optional]_,
  ::: tip
  `master` by default.
  :::
- `target`: the target branch _[optional]_.
  ::: tip
  current branch return by the `data.branchBranch` attribute of the previous `RuleResult`.
  :::

To use the `CreatePullRequestRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: CreatePullRequestRunnable
    args:
      title: 'WIP: {{data.branchSplit.1}}'
      description: 'this is the description'
```

## DeleteBranchRunnable

### Goal

The `DeleteBranchRunnable` delete a particular branch.

### Usage

This Post-Action has one optionnal arg:

- `branchName`: the branch to delete _[optional]_.
  ::: tip
  If no branch name is provide, it will be set to `data.branchBranch` returned by the previous rule.
  :::

To use the `DeleteBranchRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: DeleteBranchRunnable
    args:
      branchName: develop
```

## DeleteFilesRunnable

### Goal

The `DeleteFilesRunnable` delete a set of files.

### Usage

This Post-Action need the following args:

- files: the files list to delete or a comma-separated string _[optional]_,
- message: the commit message _[optional]_,
  ::: tip
  If not provide, it will be `removing file`
  :::
- branch: the branch on which it will delete the files _[optional]_.
  ::: tip
  If no branch name is provide, it will be set to `data.branchBranch` returned by the previous rule if exist, `master` otherwise.
  :::

To use the `DeleteFilesRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: DeleteFilesRunnable
    args:
      message: 'deleting file!'
      branch: master
      files:
        - a.exe
        - b.exe
      # or
      # files: 'a.exe,b.exe'
      #
      # can be chained with `checkAddedFiles`
      # files: '{{#data.addedFiles}}{{.}},{{/data.addedFiles}}
```

## LoggerRunnable

### Goal

The `LoggerRunnable` Post-Action, like its name suggest, log informations, using [winston logger](https://github.com/winstonjs/winston).

### Usage

This Post-Action need two args:

- `type`: info|warn|error _[optional]_,
  ::: tip
  If you're in an `onSuccess` or `onBoth` statement, the default value will be `info`. On the other hand, if you're in an `onError` statement, it would be `error`.
  :::
- `message`: a string that can contain _handlebars_ templating.

To use the `LoggerRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onSuccess:
  - callback: LoggerRunnable
    args:
      type: info
      message: '{{data.issue.title}} is correct issue title'
```

## MergePullRequestRunnable

### Goal

`MergePullRequestRunnable` merge the PR or MR processed by the previous rule.

::: warning
Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
:::

### Usage

This Post-Action need the following args:

- `commitTitle`: the title of the commit _[optional]_,
- `commitMessage`: extra commit informations _[optional]_,
  ::: warning
  Not available on Gitlab
  :::
- `sha`: sha that pull request head must match to allow merge _[optional]_,
- `method`: merge|squash|rebase _[optional]_.
  ::: tip
  Default `method` value is `merge`
  :::
  ::: warning
  `rebase` does not exist on Gitlab
  :::

To use the `MergePullRequestRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onSuccess:
  - callback: MergePullRequestRunnable
    args:
      commitTitle: 'merging {{data.branchBranch}} PR'
      commitMessage: 'extra informations...'
      sha: 6dcb09b5b57875f334f61aebed695e2e4193db5e
      method: squash
```

## SendEmailRunnable

### Goal

`SendEmailRunnable` allows you to send Email with the Gmail API.

If you're using **Hygie** through our API, you do not have any configuration to do.
::: warning
But be aware, emails will be sent as **dx.developer.experience@gmail.com**.
:::
Otherwise, in case of self-hosted solution, make sure you have followed the [getting started section](../guide/gettingStarted.html#google-api).

### Usage

This Post-Action need the following args:

- `to`: the email of the addressee,
- `subject`: the subject of your email,
- `message`: the content of your email.

::: tip
`subject` and `message` support HTML.
:::

To use the `SendEmailRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onSuccess:
  - callback: SendEmailRunnable
    args:
      to: bastien.terrier@gmail.com
      subject: 'New issue (#{{data.issue.number}}) '
      message: '<b>{{data.issue.title}}</b> has been created!'
```

## UpdateCommitStatusRunnable

### Goal

`UpdateCommitStatusRunnable` updates the commits' status processed by the previous rule.

::: warning
Be sure that the previous rule returned the `commits` property in the `RuleResult` object.
:::

### Usage

This Post-Action need the following args:

- `successTargetUrl`: the URL to redirect to in case of success,
- `failTargetUrl`: the URL to redirect to in case of failure,
- `successDescriptionMessage`: the shown message on success,
- `failDescriptionMessage`: the shown message on failure.

To use the `UpdateCommitStatusRunnable`, add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onBoth:
  - callback: UpdateCommitStatusRunnable
    args:
      successTargetUrl: 'https://gist.github.com/stephenparish/9941e89d80e2bc58a153#examples'
      failTargetUrl: 'https://gist.github.com/stephenparish/9941e89d80e2bc58a153#examples'
      successDescriptionMessage: 'Commit message matches the Good Practices!'
      failDescriptionMessage: 'Caution, your commit message do not matches the Good Practices!'
```

## UpdateIssueRunnable

### Goal

`UpdateIssueRunnable` update some issue's properties.

::: warning
Be sure that the rule returned the `issueNumber` property in the `RuleResult` object.
:::

### Usage

This Post-Action need the following args:

- `labels`: the string list of labels _[optional]_,
  ::: warning
  Be careful, this will not appened `labels` to existing one, but overwrite them.
  :::
- `state`: open|close _[optional]_.

To use the `UpdateIssueRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: UpdateIssueRunnable
    args:
      labels:
        - good first issue
        - enhancement
      state: open
```

## UpdatePullRequestRunnable

### Goal

`UpdatePullRequestRunnable` update some PR's properties.

::: warning
Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
:::

### Usage

This Post-Action need the following args:

- `target`: the branch target _[optional]_,
- `title`: the title of the PR _[optional]_,
- `state`: open|close _[optional]_,
- `description`: the PR description _[optional]_.

To use the `UpdatePullRequestRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback: UpdatePullRequestRunnable
    args:
      target: 'my_target_branch'
      title: 'WIP: add custom rules'
      description: 'some extra informations...'
      state: open
```

## WebhookRunnable

### Goal

`WebhookRunnable` sends a POST request to the provided URL with custom `data` and `config`.

### Usage

This Post-Action need the following args:

- `url`: the string url,
- `data`: the data you want to send (`any` type) _[optional]_,
- `config`: the `AxiosRequestConfig` configuration _[optional]_.

All of these parameters can contain _handlebars_ templating.

To use the `WebhookRunnable`, simply add the `callback` on your `.rulesrc` config file.

```yaml
# ...
onError:
  - callback : WebhookRunnable
    args:
        url: 'https://webhook.site/0de43177-bcfe-e2f6a2845ce8'
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
