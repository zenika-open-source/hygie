module.exports = {
  base: '/hygie/',
  title: 'Hygie',
  description:
    "Hygie is an easy-to-use Open-Source REST API allowing you to interact with GIT events. This NestJS API expose a set of customizable rules to automate your project's life cycle.",

  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/assets/favicon/apple-icon-57x57.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/assets/favicon/apple-icon-60x60.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/assets/favicon/apple-icon-72x72.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/assets/favicon/apple-icon-76x76.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/assets/favicon/apple-icon-114x114.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/assets/favicon/apple-icon-120x120.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/assets/favicon/apple-icon-144x144.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/assets/favicon/apple-icon-152x152.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/assets/favicon/apple-icon-180x180.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/assets/favicon/android-icon-192x192.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/assets/favicon/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/assets/favicon/favicon-96x96.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/assets/favicon/favicon-16x16.png',
      },
    ],
    ['link', { rel: 'manifest', href: '/assets/favicon/manifest.json' }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/assets/favicon/favicon/ms-icon-144x144.png',
      },
    ],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
  themeConfig: {
    repo: 'zenika-open-source/hygie',
    docsRepo: 'zenika-open-source/hygie',
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
        link: 'https://zenika-open-source.github.io/hygie/tsdoc/',
      },
    ],
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [
          '/guide/gettingStarted.md',
          '/guide/configGenerator.md',
          '/guide/registerToken.md',
          '/guide/registerCron.md',
          '/guide/caution.md',
          '/guide/useEnvVar.md',
          '/guide/selfHosted.md',
        ],
      },
      {
        title: 'Rules',
        collapsable: false,
        children: [
          '/rules/customisableRules.md',
          '/rules/existingRules.md',
          '/rules/rulesExample.md',
          '/rules/groups.md',
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
  hygieURL: 'https://webhooks-sklnx3jldq-uc.a.run.app/',
  markdown: {
    toc: { includeLevel: [2, 2] },
  },
};
