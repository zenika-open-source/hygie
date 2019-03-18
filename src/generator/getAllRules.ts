import { RulesValues } from '../rules/rules.module';

import * as fs from 'fs';
export function getAllRules(): object {
  const path = require('path');

  const rulesPath = RulesValues.map(r => {
    return `${r.name[0].toLowerCase()}${r.name.substr(
      1,
      r.name.length - 5,
    )}.rule.ts`;
  });

  let contentFile: string = '';

  return rulesPath.map(rulePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../rules/' + rulePath),
      'utf-8',
    );
    const rule: any = {};

    rule.runnables = [];

    const regexName = new RegExp(/@RuleDecorator\('(.*)'\)/);
    rule.name = contentFile.match(regexName)[1];

    let interfaceOptions = contentFile.substring(
      contentFile.indexOf('interface'),
    );
    interfaceOptions = interfaceOptions.substr(
      0,
      interfaceOptions.indexOf('}'),
    );
    interfaceOptions = interfaceOptions.substr(interfaceOptions.indexOf('\n'));
    interfaceOptions = interfaceOptions.replace(/( |\n|\r)/g, '');
    const options: string[] = interfaceOptions.split(';');

    // Remove last 'null' element
    options.pop();

    rule.options = options.map(o => {
      const [name, type] = o.split(':');
      return {
        name,
        type,
        value: '',
      };
    });

    return rule;
  });
}
