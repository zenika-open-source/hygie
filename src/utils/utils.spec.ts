import { Utils } from './utils';

const fs = require('fs');
jest.mock('fs');

describe('dotenv utils', () => {
  it('should call fs', () => {
    fs.readFileSync.mockReturnValue(
      `gitApi=https://gitapi.com
gitToken=azertyuiop`,
    );

    Utils.loadEnv('myFilePath');

    expect(process.env.gitApi).toBe('https://gitapi.com');
    expect(process.env.gitToken).toBe('azertyuiop');
  });
});
