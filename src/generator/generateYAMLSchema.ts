import { getYAMLSchema } from './getYAMLSchema';

const fs = require('fs-extra');

fs.writeJsonSync('./rules-schema.json', getYAMLSchema());
