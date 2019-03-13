export function RuleDecorator(ruleName): ClassDecorator {
  return (target: any) => {
    target.prototype.name = ruleName;
  };
}
