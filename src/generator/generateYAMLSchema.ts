import { getYAMLSchema } from './getYAMLSchema';

const fs = require('fs-extra');
const path = require('path');

fs.writeJsonSync(path.resolve(__dirname, 'rules-schema.json'), getYAMLSchema());
