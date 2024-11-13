import { Exception } from '@adonisjs/core/exceptions';

export default abstract class InvalidQuery extends Exception {
  public static readonly code = 'E_INVALID_QUERY_EXCEPTION';
}
