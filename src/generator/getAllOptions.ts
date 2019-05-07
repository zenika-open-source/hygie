import { RulesOptions } from '../rules/rules.options';
import * as fs from 'fs';
import { getAllComments } from './utils';

export function getAllOptions(): object {
  const path = require('path');
  const contentFile = fs.readFileSync(
    path.resolve(__dirname, '../rules/rules.options.ts'),
    'utf-8',
  );

  const AllComments = getAllComments(contentFile);

  // Remove class comment
  AllComments.shift();

  return Object.entries(new RulesOptions()).map((o, i) => {
    return {
      name: o[0],
      value: o[1],
      tooltip: AllComments[i],
    };
  });
}

export function getAllOptionsYAML(): object {
  const path = require('path');
  const contentFile = fs.readFileSync(
    path.resolve(__dirname, '../rules/rules.options.ts'),
    'utf-8',
  );

  const AllComments = getAllComments(contentFile);

  // Remove class comment
  AllComments.shift();

  return Object.entries(new RulesOptions()).map((o, i) => {
    const name: string = o[0];
    const type: any = typeof o[1];
    return `
      ${name}: {
        type: '${type}',
        description: '${AllComments[i]}'
      }${i < AllComments.length - 1 ? ',' : ''}
    `;
  });
}
