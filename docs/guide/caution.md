# Caution

Before starting, there's a few things you need to know.

## Fetch the `.rulesrc` file

By default, _Hygie_ will fetch the `.rulesrc` file of your working branch.
That means if you're commiting on the `develop` branch, we'll use the `.hygie/.rulesrc` file located in that branch.

If you don't have that file, we'll look at your **default branch**: `master` for most of you.
If no file is founded, we will use [our default file](https://github.com/DX-DeveloperExperience/hygie-configuration/blob/master/.rulesrc).

Consequently, you don't need to do anything else that register your repo in the [registration section](./registerToken.md) before starting. But, we strongly recommand you to create your own `.hygie/.rulesrc` file to customize the rules and post-actions to fit your needs.

## Issues

When you want to use our application to deal with Issues, you must be aware of a thing: Issue has no attached branch, that means that we'll use your `.rulesrc` file located in our **default branch** (or ours if missing).

## Pull Requests / Merge Requests

When you're creating a Pull Request (Merge Request), we'll use the `.rulesrc` file of the source branch.

For example, if you want the merge the content of `develop` to `master`, for every event related to this PR (MR), we'll use the `develop`'s `.rulesrc` file.
