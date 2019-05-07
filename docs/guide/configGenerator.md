# Config Generator

You can customize your `rules.yml` config file with the [Git-Webhooks-Config-Generator project](https://github.com/DX-DeveloperExperience/git-webhooks-config-generator).

This SPA allows you to generate this file with a friendly user-interface.

[Check it out](https://dx-developerexperience.github.io/git-webhooks-config-generator/)!

## Autocomplete `rules*.yml` files

If for some reasons, you have to edit your `rules*.yml` files manually, you can import our [JSON Schema](https://dx-developerexperience.github.io/git-webhooks/rules-schema.json) that provide autocomplete for all rules and runnables.

Check-out your editor setting to know how to use it.

### Visual Studio Code

If you're using Visual Studio Code, you need to install the [YAML extension from Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).
Then, open the `settings.json` file and add the following code:

```json
"yaml.schemas": {
    "https://dx-developerexperience.github.io/git-webhooks/rules-schema.json": "**/rules*.yml"
}
```
