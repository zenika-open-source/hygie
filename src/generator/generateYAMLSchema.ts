import { getYAMLSchema } from './getYAMLSchema';

const fs = require('fs-extra');

fs.writeJsonSync('/testSchema.json', getYAMLSchema());
