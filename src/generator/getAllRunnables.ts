import { RunnablesValues } from '../runnables/runnable.module';
import * as fs from 'fs-extra';
import { getAllComments } from './utils';

export function getAllRunnables(): object {
  const path = require('path');

  const runnablesPath = RunnablesValues.map(r => {
    return `${r.name[0].toLowerCase()}${r.name.substr(
      1,
      r.name.length - 9,
    )}.runnable.ts`;
  });

  let contentFile: string = '';

  return runnablesPath.map(runnablePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../runnables/' + runnablePath),
      'utf-8',
    );

    const runnable: any = {};

    runnable.tooltip = getAllComments(contentFile)[0];

    const regexName = new RegExp(/@RunnableDecorator\('(.*)'\)/);
    runnable.name = contentFile.match(regexName)[1];

    let interfaceArgs = contentFile.substring(
      contentFile.indexOf('interface '),
    );
    interfaceArgs = interfaceArgs.substr(0, interfaceArgs.indexOf('}'));
    interfaceArgs = interfaceArgs.substr(interfaceArgs.indexOf('\n'));
    interfaceArgs = interfaceArgs.replace(/( |\n|\r)/g, '');
    const args: string[] = interfaceArgs.split(';');

    // Remove last 'null' element
    args.pop();

    runnable.args = args.map(a => {
      const [name, type] = a.split(':');
      return {
        name: name.replace('?', ''),
        type,
        value: '',
      };
    });

    return runnable;
  });
}

export function getAllYAMLRunnablesName(): object {
  const path = require('path');

  const runnablesPath = RunnablesValues.map(r => {
    return `${r.name[0].toLowerCase()}${r.name.substr(
      1,
      r.name.length - 9,
    )}.runnable.ts`;
  });

  let contentFile: string = '';

  return runnablesPath.map(runnablePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../runnables/' + runnablePath),
      'utf-8',
    );

    const tooltip: string = getAllComments(contentFile)[0];

    const regexName = new RegExp(/@RunnableDecorator\('(.*)'\)/);
    const name = contentFile.match(regexName)[1];

    return { enum: [name], description: tooltip };
  });
}

export function getAllYAMLRunnablesArgs(): object {
  const path = require('path');

  const runnablesPath = RunnablesValues.map(r => {
    return `${r.name[0].toLowerCase()}${r.name.substr(
      1,
      r.name.length - 9,
    )}.runnable.ts`;
  });

  let contentFile: string = '';

  return runnablesPath.map(runnablePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../runnables/' + runnablePath),
      'utf-8',
    );

    const runnable: any = {};

    runnable.tooltip = getAllComments(contentFile)[0];

    const regexName = new RegExp(/@RunnableDecorator\('(.*)'\)/);
    runnable.name = contentFile.match(regexName)[1];

    let interfaceArgs = contentFile.substring(
      contentFile.indexOf('interface '),
    );
    interfaceArgs = interfaceArgs.substr(0, interfaceArgs.indexOf('}'));
    interfaceArgs = interfaceArgs.substr(interfaceArgs.indexOf('\n'));
    interfaceArgs = interfaceArgs.replace(/( |\n|\r)/g, '');

    const args: string[] = interfaceArgs.split(';');

    // Remove last 'null' element
    args.pop();

    runnable.args = args.map(a => {
      const [name, type] = a.split(':');
      const allTypes: string[] = type.split('|');
      const realTypes: string[] = allTypes.map(t => {
        return t.includes('[]')
          ? 'array'
          : ['boolean', 'string', 'number'].includes(t)
          ? t
          : 'object';
      });

      return {
        [name.replace('?', '')]: {
          type: realTypes,
        },
      };
    });

    return {
      properties: {
        callback: { enum: [runnable.name] },
        args: {
          type: 'object',
          description: `${runnable.name} args`,
          properties: runnable.args.reduce((a, b) => Object.assign(a, b), {}),
        },
      },
    };
  });
}
