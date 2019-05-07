beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllRules', () => {
  it('should return an array of objects', () => {
    // expect(getAllRules()).toEqual([
    //   {
    //     tooltip:
    //       '`CommitMessageRule` checks all commits title according to a regular expression and an optional max size.',
    //     runnables: [],
    //     enabled: true,
    //     name: 'commitMessage',
    //     options: [
    //       { name: 'regexp', type: 'string', value: '' },
    //       { name: 'maxLength', type: 'number', value: '' },
    //       { name: 'branches', type: 'BranchesOptions', value: '' },
    //     ],
    //   },
    //   {
    //     tooltip:
    //       '`OneCommitPerPRRule` checks if there is only one commit in the current PR, MR or Push.',
    //     runnables: [],
    //     enabled: true,
    //     name: 'oneCommitPerPR',
    //     options: [],
    //   },
    // ]);
  });
});
