export function getObjectValue(obj: object): object {
  return typeof obj === 'undefined' ? {} : obj;
}

export function getStringValue(str: string): string {
  return typeof str === 'undefined' ? '' : str;
}
