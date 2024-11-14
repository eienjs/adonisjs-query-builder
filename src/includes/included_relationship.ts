import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type Include } from '../types.js';

export default class IncludedRelationship<Model extends LucidModel, Result = InstanceType<Model>>
  implements Include<Model, Result>
{
  public getRequestedFieldsForRelatedTable?: (relationship: string) => string[];

  public _invoke(query: ModelQueryBuilderContract<Model, Result>, include: string): void {
    const relatedTables = include.split('.');
  }

  public static getIndividualRelationshipPathsFromInclude(include: string): string[] {
    const includes: string[] = [];

    for (const relationship of include.split('.')) {
      if (includes.length === 0) {
        includes.push(relationship);

        continue;
      }

      includes.push(`${includes.slice(-1)}.${relationship}`);
    }

    return includes;
  }
}
