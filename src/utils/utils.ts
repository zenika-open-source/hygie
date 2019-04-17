export class Utils {
  static getObjectValue(obj: object): object {
    return typeof obj === 'undefined' ? {} : obj;
  }

  static getStringValue(str: string): string {
    return typeof str === 'undefined' ? '' : str;
  }

  static loadEnv(filePath: string) {
    const fs = require('fs');
    const dotenv = require('dotenv');
    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    // tslint:disable-next-line:forin
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  static writeFileSync(fileName: string, fileContent: string): boolean {
    const fs = require('fs');
    const path = require('path');
    fs.promises.mkdir(path.dirname(fileName), { recursive: true }).then(x =>
      fs.writeFileSync(fileName, fileContent, err => {
        if (err) {
          throw err;
        }
      }),
    );
    return true;
  }

  /**
   * Generate a unique String Id
   * https://gist.github.com/gordonbrander/2230317
   */
  static generateUniqueId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
      '#' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }
}
