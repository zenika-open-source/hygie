import {
  CronInterface,
  isCronInterface,
  isCronInterfaceArray,
  convertCronType,
} from '../../src/scheduler/cron.interface';

const cron1: CronInterface[] = [
  {
    filename: 'cron-1-1.rulesrc',
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
  {
    filename: 'cron-1-2.rulesrc',
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
  {
    filename: 'cron-1-3.rulesrc',
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
];
const cron2: CronInterface[] = [
  {
    filename: [
      'cron-2-1-1.rulesrc',
      'cron-2-1-2.rulesrc',
      'cron-2-1-3.rulesrc',
    ],
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
  {
    filename: 'cron-2-2.rulesrc',
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
  {
    filename: 'cron-2-3.rulesrc',
    projectURL: 'https://github.com/zenika-open-source/hygie',
  },
];
const cron3: CronInterface = {
  filename: ['cron-3-1-1.rulesrc', 'cron-3-1-2.rulesrc', 'cron-3-1-3.rulesrc'],
  projectURL: 'https://github.com/zenika-open-source/hygie',
};
const cron4: CronInterface = {
  filename: 'cron-4-1.rulesrc',
  projectURL: 'https://github.com/zenika-open-source/hygie',
};
const cron5: CronInterface = {
  filename: 'rule-cron-4-1.yml',
  projectURL: 'https://github.com/zenika-open-source/hygie',
};

describe('Cron Interfaces', () => {
  describe('isCronInterface', () => {
    it('cron1 should return false', () => {
      expect(isCronInterface(cron1)).toBe(false);
    });
    it('cron2 should return false', () => {
      expect(isCronInterface(cron2)).toBe(false);
    });
    it('cron3 should return true', () => {
      expect(isCronInterface(cron3)).toBe(true);
    });
    it('cron4 should return true', () => {
      expect(isCronInterface(cron4)).toBe(true);
    });
  });
  describe('isCronInterfaceArray', () => {
    it('cron1 should return true', () => {
      expect(isCronInterfaceArray(cron1)).toBe(true);
    });
    it('cron2 should return true', () => {
      expect(isCronInterfaceArray(cron2)).toBe(true);
    });
    it('cron3 should return false', () => {
      expect(isCronInterfaceArray(cron3)).toBe(false);
    });
    it('cron4 should return false', () => {
      expect(isCronInterfaceArray(cron4)).toBe(false);
    });
  });

  describe('convertCronType', () => {
    it('cron1 should return a CronStandardClass array', () => {
      expect(convertCronType(cron1)).toEqual([
        {
          expression: undefined,
          filename: 'cron-1-1.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-1-2.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-1-3.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
      ]);
    });
    it('cron2 should return a CronStandardClass array', () => {
      expect(convertCronType(cron2)).toEqual([
        {
          expression: undefined,
          filename: 'cron-2-1-1.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-2-1-2.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-2-1-3.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-2-2.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-2-3.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
      ]);
    });
    it('cron3 should return a CronStandardClass array', () => {
      expect(convertCronType(cron3)).toEqual([
        {
          expression: undefined,
          filename: 'cron-3-1-1.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-3-1-2.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
        {
          expression: undefined,
          filename: 'cron-3-1-3.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
      ]);
    });
    it('cron4 should return a CronStandardClass array', () => {
      expect(convertCronType(cron4)).toEqual([
        {
          expression: undefined,
          filename: 'cron-4-1.rulesrc',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/zenika-open-source/hygie',
        },
      ]);
    });
    it('cron5 should throw an exception', () => {
      function myFunc() {
        return convertCronType(cron5);
      }
      expect(myFunc).toThrow('Filename must fit the pattern: `cron-*.rulesrc`');
    });
  });
});
