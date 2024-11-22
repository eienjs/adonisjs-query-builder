import string from '@adonisjs/core/helpers/string';
import app from '@adonisjs/core/services/app';
import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include } from '../types/main.js';

export default class IncludedCount<Model extends LucidModel, Result = InstanceType<Model>>
  implements Include<Model, Result>
{
  public _invoke(query: ModelQueryBuilderContract<Model, Result>, include: string): void {
    const countSuffix = app.config.get<string>('querybuilder.countSuffix', 'Count');
    const relationship = string.create(include).removeSuffix(countSuffix).toString();
    if (!query.model.$hasRelation(relationship)) {
      return;
    }

    void query.withCount(relationship as ExtractModelRelations<InstanceType<Model>>, (subQuery) => {
      void subQuery.as(countSuffix);
    });
  }
}
