module.exports = {
  base: '/git-webhooks/',
  title: 'Git Webhooks',
  description:
    "Git Webhooks is an easy-to-use Open-Source REST API allowing you to interact with GIT events. This NestJs API expose a set of customizable Rules to automate your project's life cycle.",
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
    ],
    sidebar: [
      '/',
      {
        title: 'Guide',
        collapsable: false,
        children: ['/guide/gettingStarted.md'],
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
