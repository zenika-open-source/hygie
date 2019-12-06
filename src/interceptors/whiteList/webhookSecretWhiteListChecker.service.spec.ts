import { WebhookSecretWhiteListChecker } from './webhookSecretWhiteListChecker.service';

describe('WebhookSecretWhiteListChecker', () => {
  const processEnvService = {
    get(key: string) {
      return 'token';
    },
  };

  let webhookSecretWhiteListChecker;
  beforeAll(() => {
    webhookSecretWhiteListChecker = new WebhookSecretWhiteListChecker(
      processEnvService,
    );
  });
  it('should return false if we do not have the Gitlab or Gitlab token', () => {
    expect(
      webhookSecretWhiteListChecker.isAccepted({ headers: {} } as any),
    ).toBeFalsy();
  });
  describe('Gitlab', () => {
    it('should return true if the token is correct', () => {
      expect(
        webhookSecretWhiteListChecker.isAccepted({
          headers: { 'x-gitlab-token': 'token' },
        } as any),
      ).toBeTruthy();
    });
    it('should return false if the token is not correct', () => {
      expect(
        webhookSecretWhiteListChecker.isAccepted({
          headers: { 'x-gitlab-token': 'toto' },
        } as any),
      ).toBeFalsy();
    });
  });
  describe('Github', () => {
    const CryptoJS = require('crypto-js');
    const body = { body: 'body' };
    const signature: string =
      'sha1=' + CryptoJS.HmacSHA1(JSON.stringify(body), 'token').toString();

    it('should return true if the token is correct', () => {
      expect(
        webhookSecretWhiteListChecker.isAccepted({
          body,
          headers: { 'x-hub-signature': signature },
        } as any),
      ).toBeTruthy();
    });
    it('should return false if the token is not correct', () => {
      expect(
        webhookSecretWhiteListChecker.isAccepted({
          body,
          headers: { 'x-hub-signature': 'falsySignature' },
        } as any),
      ).toBeFalsy();
    });
  });
});
