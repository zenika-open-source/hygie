import { WhiteListCheckerI } from './whiteListChecker.interface';
import { ProcessEnvService } from '../../common/providers/processEnv.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookSecretWhiteListChecker implements WhiteListCheckerI {
  constructor(private processEnvService: ProcessEnvService) {}
  isAccepted(request: Request): boolean {
    const WEBHOOK_SECRET = this.processEnvService.get('WEBHOOK_SECRET');
    const CryptoJS = require('crypto-js');
    const Compare = require('secure-compare');

    if (typeof request.headers['x-hub-signature'] !== 'undefined') {
      const bodyRequest: any = request.body;

      const gitSignature = request.headers['x-hub-signature'];
      const signature: string =
        'sha1=' +
        CryptoJS.HmacSHA1(
          JSON.stringify(bodyRequest),
          WEBHOOK_SECRET,
        ).toString();

      return Compare(signature, gitSignature);
    } else if (request.headers['x-gitlab-token']) {
      return request.headers['x-gitlab-token'] === WEBHOOK_SECRET;
    }
    return false;
  }
}
