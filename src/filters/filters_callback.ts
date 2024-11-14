import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';

export default class FiltersCallback<Model extends LucidModel, Result = InstanceType<Model>>
  implements Filter<Model, Result>
{
  public constructor(
    private readonly callback: (
      query: ModelQueryBuilderContract<Model, Result>,
      value: StrictValuesWithoutRaw,
      property: string,
    ) => void,
  ) {}

  public _invoke(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw,
    property: string,
  ): void {
    this.callback(query, value, property);
  }
}
