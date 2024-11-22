import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types/main.js';

export default class FiltersTrashed<Model extends LucidModel, Result = InstanceType<Model>>
  implements Filter<Model, Result>
{
  public _invoke(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw | null,
    _property: string,
  ): void {
    if (!('withTrashed' in query && 'onlyTrashed' in query)) {
      return;
    }

    const queryWithSoftDeletes = query as {
      withTrashed(): ModelQueryBuilderContract<Model, Result>;
      onlyTrashed(): ModelQueryBuilderContract<Model, Result>;
    };

    if (value === 'with') {
      void queryWithSoftDeletes.withTrashed();

      return;
    }

    if (value === 'only') {
      void queryWithSoftDeletes.onlyTrashed();
    }
  }
}
