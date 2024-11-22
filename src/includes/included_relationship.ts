import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include } from '../types/main.js';

export default class IncludedRelationship<Model extends LucidModel, Result = InstanceType<Model>>
  implements Include<Model, Result>
{
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

  public getRequestedFieldsForRelatedTable?: (relationship: string) => string[];

  public _invoke(query: ModelQueryBuilderContract<Model, Result>, include: string): void {
    const relatedTables = include.split('.');
    this.buildNestedQuery(relatedTables, query);
  }

  private buildNestedQuery<SubModel extends LucidModel, IntanceResult = InstanceType<SubModel>>(
    relatedTables: string[],
    subQuery: ModelQueryBuilderContract<SubModel, IntanceResult>,
    parent = '',
  ): void {
    if (relatedTables.length === 0) {
      return;
    }

    const [relation, ...rest] = relatedTables;

    if (!subQuery.model.$hasRelation(relation)) {
      return;
    }

    void subQuery.preload(relation as ExtractModelRelations<InstanceType<SubModel>>, (nestedQuery) => {
      const fullRelationName = parent === '' ? relation : `${parent}.${relation}`;
      if (this.getRequestedFieldsForRelatedTable !== undefined) {
        const fields = this.getRequestedFieldsForRelatedTable(fullRelationName);
        if (fields.length > 0) {
          void nestedQuery.select(fields);
        }
      }

      this.buildNestedQuery(rest, nestedQuery, fullRelationName);
    });
  }
}
