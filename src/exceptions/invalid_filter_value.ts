import { Exception } from '@adonisjs/core/exceptions';

export default class InvalidFilterValue extends Exception {
  public static make(value: unknown): InvalidFilterValue {
    return new InvalidFilterValue(`Filter value \`${value}\` is invalid`);
  }
}
