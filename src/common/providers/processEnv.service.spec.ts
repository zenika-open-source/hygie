import { ProcessEnvService } from './processEnv.service';
describe('ProcessEnvService', () => {
  let processEnvService;
  beforeAll(() => {
    processEnvService = new ProcessEnvService();
  });
  it('should return the value from process.env', () => {
    process.env.TEST = 'test';
    expect(processEnvService.get('TEST')).toBe(process.env.TEST);
  });
});
