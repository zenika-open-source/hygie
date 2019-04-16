# All existing runnables

This section describes each existing runnables: what's its goal and how to use it.

<TOC :include-level="[2, 2]"/>

## CommentIssueRunnable

### Goal

`CommentIssueRunnable` comments the Issue processed by the previous rule.

::: warning
Be sure that the rule returned the `issueNumber` property in the `RuleResult` object.
:::

### Usage

This Post-Action only needs a string message. This string can contain _mustache_ templating.

To use the `CommentIssueRunnable`, add the `callback` on your `rules.yml` config file.

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
Be sure that the rule returned the `pullRequestNumber` property in the `RuleResult` object.
:::

### Usage

This Post-Action only needs a string message. This string can contain _mustache_ templating.

To use the `CommentPullRequestRunnable`, add the `callback` on your `rules.yml` config file.

```yaml
# ...
onError:
  - callback: CommentPullRequestRunnable
    args:
      comment: 'ping @bastienterrier'
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
  current branch return by the `data.branch` attribute of the previous `RuleResult`.
  :::

To use the `CreatePullRequestRunnable`, add the `callback` on your `rules.yml` config file.

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

- `branchName`: the branch to delete _[optional]_,
  ::: tip
  If no branch name is provide, it will be set to `data.branch` returned by the previous rule.
  :::

To use the `DeleteBranchRunnable`, simply add the `callback` on your `rules.yml` config file.

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

- files: the files list to delete,
- message: the commit message _[optional]_,
  ::: tip
  If not provide, it will be `removing some files'`
  :::
- branch: the branch on which it will delete the files _[optional]_,
  ::: tip
  If no branch name is provide, it will be set to `data.branch` returned by the previous rule if exist, `master` otherwise.
  :::

To use the `DeleteFilesRunnable`, simply add the `callback` on your `rules.yml` config file.

```yaml
# ...
onError:
  - callback: DeleteFilesRunnable
    args:
      files:
        - a.exe
        - b.exe
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
- `message`: a string that can contain _mustache_ templating.

To use the `LoggerRunnable`, simply add the `callback` on your `rules.yml` config file.

```yaml
# ...
onSuccess:
  - callback: LoggerRunnable
    args:
      type: info
      message: '{{data.issueTitle}} is correct issue title'
```

## SendEmailRunnable

### Goal

`SendEmailRunnable` allows you to send Email with the Gmail API.

::: warning
Be sure to have configured the Gmail API as explained in the [getting started section](../guide/gettingStarted.html#google-api).
:::

### Usage

This Post-Action need the following args:

- `to`: the email of the addressee,
- `subject`: the subject of your email,
- `message`: the content of your email.

::: tip
`subject` and `message` support HTML.
:::

To use the `SendEmailRunnable`, add the `callback` on your `rules.yml` config file.

```yaml
# ...
onSuccess:
  - callback: SendEmailRunnable
    args:
      to: bastien.terrier@gmail.com
      subject: 'New issue (#{{data.issueNumber}}) '
      message: '<b>{{data.issueTitle}}</b> has been created!'
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

To use the `UpdateCommitStatusRunnable`, add the `callback` on your `rules.yml` config file.

```yaml
# ...
onBoth:
  - callback: UpdateCommitStatusRunnable
    args:
      successTargetUrl: 'http://www.ok.com'
      failTargetUrl: 'http://www.ko.com/'
      successDescriptionMessage: 'Good commit message!'
      failDescriptionMessage: 'Not good...'
```

## WebhookRunnable

### Goal

`WebhookRunnable` sends a POST request to the provided URL with custom `data` and `config`.

### Usage

This Post-Action need the following args:

- `url`: the string url,
- `data`: the data you want to send (`any` type) _[optional]_,
- `config`: the `AxiosRequestConfig` configuration _[optional]_.

All of these parameters can contain _mustache_ templating.

To use the `WebhookRunnable`, simply add the `callback` on your `rules.yml` config file.

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
