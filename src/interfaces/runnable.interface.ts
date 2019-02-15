export interface RunnableInterface {
  name: string;
  run(...args: any[]): void;
}
