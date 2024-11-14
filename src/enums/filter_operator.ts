import { type EnumValues } from '../types.js';

export const FilterOperator = {
  Dynamic: '',
  Equal: '=',
  LessThan: '<',
  GreaterThan: '>',
  LessThanOrEqual: '<=',
  GreaterThanOrEqual: '>=',
  NotEqual: '<>',
} as const;

export type EFilterOperator = EnumValues<typeof FilterOperator>;
