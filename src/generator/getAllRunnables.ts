import { RunnablesValues } from '../runnables/runnable.module';
import * as fs from 'fs';

export function getAllRunnables(): object {
  const path = require('path');

  const rulesPath = RunnablesValues.map(r => {
    return `${r.name[0].toLowerCase()}${r.name.substr(
      1,
      r.name.length - 9,
    )}.runnable.ts`;
  });

  let contentFile: string = '';

  return rulesPath.map(rulePath => {
    contentFile = fs.readFileSync(
      path.resolve(__dirname, '../runnables/' + rulePath),
      'utf-8',
    );

    const runnable: any = {};

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
        name,
        type,
        value: '',
      };
    });

    return runnable;
  });
}
