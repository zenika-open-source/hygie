export function loadEnv(filePath: string) {
  const fs = require('fs');
  const dotenv = require('dotenv');
  const envConfig = dotenv.parse(fs.readFileSync(filePath));
  // tslint:disable-next-line:forin
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
