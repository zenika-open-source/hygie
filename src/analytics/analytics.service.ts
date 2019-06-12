import * as ua from 'universal-analytics';
export const analytics: ua.Visitor = ua(process.env.ANALYTICS_ID);
