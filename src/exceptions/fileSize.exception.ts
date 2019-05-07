export function FileSizeException(file: string) {
  this.message = `${file} too big!`;
  this.name = 'FileSizeException';
}
