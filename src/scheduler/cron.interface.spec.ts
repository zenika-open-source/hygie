import {
  CronInterface,
  isCronInterface,
  isCronInterfaceArray,
  convertCronType,
} from './cron.interface';

const cron1: CronInterface[] = [
  {
    filename: 'rules-cron-1-1.yml',
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
  {
    filename: 'rules-cron-1-2.yml',
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
  {
    filename: 'rules-cron-1-3.yml',
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
];
const cron2: CronInterface[] = [
  {
    filename: [
      'rules-cron-2-1-1.yml',
      'rules-cron-2-1-2.yml',
      'rules-cron-2-1-3.yml',
    ],
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
  {
    filename: 'rules-cron-2-2.yml',
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
  {
    filename: 'rules-cron-2-3.yml',
    projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
  },
];
const cron3: CronInterface = {
  filename: [
    'rules-cron-3-1-1.yml',
    'rules-cron-3-1-2.yml',
    'rules-cron-3-1-3.yml',
  ],
  projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
};
const cron4: CronInterface = {
  filename: 'rules-cron-4-1.yml',
  projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
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
          filename: 'rules-cron-1-1.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-1-2.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-1-3.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
      ]);
    });
    it('cron2 should return a CronStandardClass array', () => {
      expect(convertCronType(cron2)).toEqual([
        {
          expression: undefined,
          filename: 'rules-cron-2-1-1.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-2-1-2.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-2-1-3.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-2-2.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-2-3.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
      ]);
    });
    it('cron3 should return a CronStandardClass array', () => {
      expect(convertCronType(cron3)).toEqual([
        {
          expression: undefined,
          filename: 'rules-cron-3-1-1.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-3-1-2.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
        {
          expression: undefined,
          filename: 'rules-cron-3-1-3.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
      ]);
    });
    it('cron4 should return a CronStandardClass array', () => {
      expect(convertCronType(cron4)).toEqual([
        {
          expression: undefined,
          filename: 'rules-cron-4-1.yml',
          gitlabProjectId: undefined,
          projectURL: 'https://github.com/DX-DeveloperExperience/git-webhooks',
        },
      ]);
    });
  });
});
