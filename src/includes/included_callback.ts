import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include } from '../types.js';

export default class IncludeCallback<Model extends LucidModel, Result = InstanceType<Model>>
  implements Include<Model, Result>
{
  public constructor(private readonly callback: (query: ModelQueryBuilderContract<Model, Result>) => void) {}

  public _invoke(query: ModelQueryBuilderContract<Model, Result>, include: string): void {
    if (!query.model.$hasRelation(include)) {
      return;
    }

    const relation = include as ExtractModelRelations<InstanceType<Model>>;

    void query.preload(relation, this.callback);
  }
}
