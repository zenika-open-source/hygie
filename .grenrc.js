module.exports = {
  template: {
    commit: ({ message, url, author, name }) =>
      `- [${message}](${url}) - ${author ? `@${author}` : name}`,
    issue: '- {{labels}} {{name}} [{{text}}]({{url}})',
    label: '[**{{label}}**]',
    noLabel: 'closed',
    group: '\n#### {{heading}}\n',
    changelogTitle: '# Changelog\n\n',
    release: '## {{release}} ({{date}})\n{{body}}',
    releaseSeparator: '\n---\n\n',
  },
  groupBy: {
    'Enhancements:': ['enhancement', 'internal'],
    'Bug Fixes:': ['bug'],
    'Rules:': ['rules'],
    'Post-Actions:': ['post actions'],
    'Cron Jobs': ['CRON'],
    'Documentation:': ['documentation'],
    'Others:': ['question', 'build', 'clean', 'deployment', 'security'],
  },
};
