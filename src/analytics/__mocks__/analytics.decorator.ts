export const AnalyticsDecorator = scope => (
  target: any,
  propertyName: string,
  propertyDesciptor: PropertyDescriptor,
): PropertyDescriptor => {
  return propertyDesciptor;
};
