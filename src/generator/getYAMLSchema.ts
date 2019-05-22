import { getAllYAMLRulesName, getAllYAMLRulesOptions } from './getAllRules';
import {
  getAllYAMLRunnablesName,
  getAllYAMLRunnablesArgs,
} from './getAllRunnables';
import { getAllYAMLOptions } from './getAllOptions';

// tslint:disable:quotemark
// tslint:disable:max-line-length
export function getYAMLSchema(): object {
  const rulesName = getAllYAMLRulesName();
  const rulesOptions: any = getAllYAMLRulesOptions();
  rulesOptions.push(
    { required: ['onSuccess'] },
    { required: ['onError'] },
    { required: ['onBoth'] },
  );
  const runnablesName = getAllYAMLRunnablesName();
  const runnablesArgs = getAllYAMLRunnablesArgs();
  const optionsName = getAllYAMLOptions();
  return {
    $schema: 'http://json-schema.org/schema#',
    title: 'Schema for YAML and JSON *.rulesrc files',
    properties: {
      options: optionsName,
      rules: {
        description: 'All rules.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the rule.',
              oneOf: rulesName,
            },
            enabled: {
              type: 'boolean',
              description: 'Specify if the rule will be evaluated.',
            },
            events: {
              type: 'array',
              description: 'All events on which the rule will be tested.',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
            onSuccess: {
              type: 'array',
              description: 'Array of Runnables to execute in case of Success.',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  callback: {
                    type: 'string',
                    description: 'The name of the Runnable.',
                    oneOf: runnablesName,
                  },
                },
                required: ['callback'],
                anyOf: runnablesArgs,
              },
            },
            onError: {
              type: 'array',
              description: 'Array of Runnables to execute in case of Error.',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  callback: {
                    type: 'string',
                    description: 'The name of the Runnable.',
                    oneOf: runnablesName,
                  },
                },
                required: ['callback'],
                anyOf: runnablesArgs,
              },
            },
            onBoth: {
              type: 'array',
              description:
                "Array of Runnables to execute after the rule's evaluation.",
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  callback: {
                    type: 'string',
                    description: 'The name of the Runnable.',
                    oneOf: runnablesName,
                  },
                },
                required: ['callback'],
                anyOf: runnablesArgs,
              },
            },
          },
          required: ['name'],
          anyOf: rulesOptions,
        },
      },
    },
  };
}
