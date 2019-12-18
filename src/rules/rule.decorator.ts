import { Rule } from './rule.class';

export function RuleDecorator(ruleName): ClassDecorator {
  return (target: any) => {
    target.prototype.name = ruleName;
  };
}

export function analyticsDecorator(
  target: Rule,
  propertyName: string,
  propertyDesciptor: PropertyDescriptor,
): PropertyDescriptor {
  const method = propertyDesciptor.value;

  propertyDesciptor.value = function(...args: any[]) {
    const ruleName = this.name;
    const projectURL = args[0].getCloneURL();

    this.googleAnalytics.event('Rule', ruleName, projectURL);

    // Apply and return the original method
    return method.apply(this, args);
  };
  return propertyDesciptor;
}
