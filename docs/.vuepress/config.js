module.exports = {
  title: 'Git Webhooks',
  description:
    "API REST permettant d'intéragir sur des évenements d'un repository GIT. Cette API mettra à disposition un ensemble de règles/actions aux utilisateurs permettant d'automatiser le cycle de vie du projet",
  themeConfig: {
    repo: 'DX-DeveloperExperience/git-webhooks',
    docsRepo: 'DX-DeveloperExperience/git-webhooks',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Rules', link: '/rules/' },
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
        ],
      },
    ],
  },
};
