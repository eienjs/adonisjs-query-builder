import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type Sort } from '../types/main.js';

export default class SortCallback<Model extends LucidModel, Result = InstanceType<Model>>
  implements Sort<Model, Result>
{
  public constructor(
    private readonly callback: (
      query: ModelQueryBuilderContract<Model, Result>,
      descending: boolean,
      property: string,
    ) => void,
  ) {}

  public _invoke(query: ModelQueryBuilderContract<Model, Result>, descending: boolean, property: string): void {
    this.callback(query, descending, property);
  }
}
