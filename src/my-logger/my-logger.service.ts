export class MyLogger {
  static Reset = '\x1b[0m';
  static Bright = '\x1b[1m';
  static Dim = '\x1b[2m';
  static Underscore = '\x1b[4m';
  static Blink = '\x1b[5m';
  static Reverse = '\x1b[7m';
  static Hidden = '\x1b[8m';

  static FgBlack = '\x1b[30m';
  static FgRed = '\x1b[31m';
  static FgGreen = '\x1b[32m';
  static FgYellow = '\x1b[33m';
  static FgBlue = '\x1b[34m';
  static FgMagenta = '\x1b[35m';
  static FgCyan = '\x1b[36m';
  static FgWhite = '\x1b[37m';

  static BgBlack = '\x1b[40m';
  static BgRed = '\x1b[41m';
  static BgGreen = '\x1b[42m';
  static BgYellow = '\x1b[43m';
  static BgBlue = '\x1b[44m';
  static BgMagenta = '\x1b[45m';
  static BgCyan = '\x1b[46m';
  static BgWhite = '\x1b[47m';

  public static log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(this.FgGreen + message + this.Reset);
  }
  public static error(message: string, trace: string) {
    // tslint:disable-next-line:no-console
    console.log(this.FgRed + message + this.Reset);
  }
  public static warn(message: string) {
    // tslint:disable-next-line:no-console
    console.log(this.FgYellow + message + this.Reset);
  }
}
