import { RulesValues } from '../rules/rules.module';
import * as fs from 'fs-extra';
import { getAllComments } from './utils';

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

    const tooltip = getAllComments(contentFile)[0];
    rule.tooltip = tooltip.substring(0, tooltip.indexOf('@return')).trim();

    rule.runnables = [];

    rule.enabled = true;

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
        name: name.replace('?', ''),
        type,
        value: '',
      };
    });

    return rule;
  });
}

export function getAllYAMLRulesName(): object {
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

    let tooltip = getAllComments(contentFile)[0];
    tooltip = tooltip.substring(0, tooltip.indexOf('@return')).trim();

    const regexName = new RegExp(/@RuleDecorator\('(.*)'\)/);
    const name = contentFile.match(regexName)[1];

    return { enum: [name], description: tooltip };
  });
}

export function getAllYAMLRulesOptions(): object {
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
      const realType: string = type.includes('[]')
        ? 'array'
        : ['boolean', 'string', 'number'].includes(type)
        ? type
        : 'object';
      return {
        [name.replace('?', '')]: {
          type: realType,
        },
      };
    });

    return {
      properties: {
        name: { enum: [rule.name] },
        options: {
          type: 'object',
          description: `${rule.name} options`,
          properties: rule.options.reduce((a, b) => Object.assign(a, b), {}),
        },
      },
    };
  });
}
