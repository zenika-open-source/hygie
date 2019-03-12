import { RulesValues } from '../rules/rules.module';

import * as fs from 'fs';
export function getAllRules(): object {
  const path = require('path');

  let result: any = {};

  const rulesPath = RulesValues.map(r => {
    return (
      r.name[0].toLowerCase() + r.name.substr(1, r.name.length - 5) + '.rule.ts'
    );
  });

  let contentFile: string = '';

  result = rulesPath.map(rulePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../rules/' + rulePath),
      'utf-8',
    );
    const rule: any = {};

    rule.runnables = [];

    const regexName = new RegExp(/name = '(.*)'/);
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
      const res: any = {};
      const option = o.split(':');
      res.name = option[0];
      res.type = option[1];
      res.value = '';
      return res;
    });

    return rule;
  });

  return result;
}
