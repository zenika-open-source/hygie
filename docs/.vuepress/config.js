module.exports = {
  base: '/git-webhooks/',
  title: 'Git Webhooks',
  description:
    "Git Webhooks is an easy-to-use Open-Source REST API allowing you to interact with GIT events. This NestJS API expose a set of customizable rules to automate your project's life cycle.",
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: `https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css`,
      },
    ],
  ],
  themeConfig: {
    repo: 'DX-DeveloperExperience/git-webhooks',
    docsRepo: 'DX-DeveloperExperience/git-webhooks',
    docsDir: 'docs',
    docsBranch: 'develop',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Rules', link: '/rules/' },
      { text: 'Post-Actions', link: '/post-actions/' },
      {
        text: 'Generator',
        link:
          'https://dx-developerexperience.github.io/git-webhooks-config-generator/',
      },
      {
        text: 'Doc',
        link: 'https://dx-developerexperience.github.io/git-webhooks/tsdoc/',
      },
    ],
    sidebar: [
      '/',
      {
        title: 'Guide',
        collapsable: false,
        children: [
          '/guide/gettingStarted.md',
          '/guide/configGenerator.md',
          '/guide/registerToken.md',
        ],
      },
      {
        title: 'Rules',
        collapsable: false,
        children: [
          '/rules/customisableRules.md',
          '/rules/branchName.md',
          '/rules/commitMessage.md',
          '/rules/issueTitle.md',
          '/rules/oneCommitPerPR.md',
        ],
      },
      {
        title: 'Post-Actions',
        collapsable: false,
        children: [
          '/post-actions/customisablePostActions.md',
          '/post-actions/loggerRunnable.md',
          '/post-actions/webhookRunnable.md',
          '/post-actions/commentIssueRunnable.md',
        ],
      },
    ],
  },
};
