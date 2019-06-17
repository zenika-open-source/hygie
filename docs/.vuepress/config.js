module.exports = {
  base: '/hygie/',
  title: 'Hygie',
  description:
    "Hygie is an easy-to-use Open-Source REST API allowing you to interact with GIT events. This NestJS API expose a set of customizable rules to automate your project's life cycle.",
  themeConfig: {
    repo: 'DX-DeveloperExperience/hygie',
    docsRepo: 'DX-DeveloperExperience/hygie',
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
          'https://dx-developerexperience.github.io/hygie-config-generator/',
      },
      {
        text: 'Doc',
        link: 'https://dx-developerexperience.github.io/hygie/tsdoc/',
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
          '/guide/registerCron.md',
        ],
      },
      {
        title: 'Rules',
        collapsable: false,
        children: [
          '/rules/customisableRules.md',
          '/rules/existingRules.md',
          '/rules/rulesExample.md',
        ],
      },
      {
        title: 'Post-Actions',
        collapsable: false,
        children: [
          '/post-actions/customisablePostActions.md',
          '/post-actions/existingRunnables.md',
        ],
      },
      {
        title: 'Others',
        collapsable: false,
        children: ['/others/events.md', '/others/dataAccess.md'],
      },
    ],
  },
  gitwebhooksURL: 'https://webhooks-sklnx3jldq-uc.a.run.app',
  markdown: {
    toc: { includeLevel: [2, 2] },
  },
};
