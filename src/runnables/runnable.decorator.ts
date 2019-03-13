export function RunnableDecorator(runnableName): ClassDecorator {
  return (target: any) => {
    target.prototype.name = runnableName;
  };
}
