import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { readFile, writeFile } from 'fs-extra';
import { createInterface } from 'readline';
import { google } from 'googleapis';
import { logger } from '../logger/logger.service';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

function makeBody(to: string, subject: string, message: string): string {
  const str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ',
    to,
    '\n',
    'subject: ',
    subject,
    '\n\n',
    message,
  ].join('');

  const encodedMail = Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return encodedMail;
}

interface SendEmailArgs {
  to: string;
  subject: string;
  message: string;
}

/**
 * `SendEmailRunnable` allows you to send Email with the Gmail API.
 * @warn Be sure to have configured the Gmail API as explained in the documentation.
 */
@RunnableDecorator('SendEmailRunnable')
export class SendEmailRunnable extends Runnable {
  // If modifying these scopes, delete token.json.
  SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
  ];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  TOKEN_PATH = 'token.json';

  sendMessage(
    authentication,
    ruleResult: RuleResult,
    args: SendEmailArgs,
  ): void {
    const gmail = google.gmail({ version: 'v1', authentication });

    const content = makeBody(
      render(args.to, ruleResult),
      render(args.subject, ruleResult),
      render(args.message, ruleResult),
    );
    gmail.users.messages.send(
      {
        auth: authentication,
        userId: 'me',
        resource: {
          raw: content,
        },
      },
      err => {
        err ? logger.error(err) : logger.info('mail sent!');
      },
    );
  }

  authorize(credentials, callback, ...args): void {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // Check if we have previously stored a token.
    readFile(this.TOKEN_PATH, (err, token) => {
      if (err) {
        return this.getNewToken(oAuth2Client, callback);
      }
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
      callback(oAuth2Client, ...args);
    });
  }

  getNewToken(oAuth2Client, callback): void {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    logger.warn(`Authorize this app by visiting this url: ${authUrl}`);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return logger.error('Error retrieving access token', err);
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        // tslint:disable-next-line:no-shadowed-variable
        writeFile(this.TOKEN_PATH, JSON.stringify(token), err => {
          if (err) {
            return logger.error(err);
          }
          logger.info('Token stored to', this.TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: SendEmailArgs,
  ): Promise<void> {
    this.googleAnalytics
      .event('Runnable', 'sendEmail', ruleResult.projectURL)
      .send();

    readFile('credentials.json')
      .then(content => {
        // Authorize a client with credentials, then call the Gmail API.
        this.authorize(
          JSON.parse(content.toString()),
          this.sendMessage,
          ruleResult,
          args,
        );
      })
      .catch(err => {
        logger.error('Error loading credentials.json:', err);
      });
  }
}
