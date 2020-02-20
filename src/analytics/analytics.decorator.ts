import { analytics } from './analytics.service';
import { Runnable } from '../runnables/runnable.class';
import { Rule } from '../rules/rule.class';
import { HYGIE_TYPE } from '../utils/enum';

export const AnalyticsDecorator = (scope: HYGIE_TYPE) => (
  target: Runnable | Rule,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor => {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function(...args: any[]) {
    const type = this.name;

    const projectURL =
      scope === HYGIE_TYPE.RULE ? args[0].getCloneURL() : args[1].projectURL;

    analytics.event(scope, type, projectURL).send();

    // Apply and return the original method
    return method.apply(this, args);
  };
  return propertyDescriptor;
};
