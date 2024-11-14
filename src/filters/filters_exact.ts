import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Filter } from '../types.js';

export default class FiltersExact<Model extends LucidModel, Result = InstanceType<Model>>
  implements Filter<Model, Result>
{
  protected $relationConstraints: string[] = [];

  public constructor(protected $addRelationConstraint = true) {}

  public _invoke(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw,
    property: string,
  ): void {
    if (this.$addRelationConstraint && this.isRelationProperty(query, property)) {
      this.withRelationConstraint(query, value, property);

      return;
    }

    if (Array.isArray(value)) {
      void query.whereIn(query.qualifyColumn(property), value);

      return;
    }

    void query.where(query.qualifyColumn(property), '=', value);
  }

  protected isRelationProperty(query: ModelQueryBuilderContract<Model, Result>, property: string): boolean {
    if (!property.includes('.')) {
      return false;
    }

    if (this.$relationConstraints.includes(property)) {
      return false;
    }

    const firstRelationship = property.split('.')[0];

    return query.model.$relationsDefinitions.has(firstRelationship);
  }

  protected withRelationConstraint(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw,
    property: string,
  ): void {
    const parts = property.split('.');
    const relationProperty = parts.pop()!;
    const relation = parts.join('.') as ExtractModelRelations<InstanceType<Model>>;

    void query.whereHas(relation, (subQuery: ModelQueryBuilderContract<Model, Result>) => {
      const fixedProperty = query.qualifyColumn(relationProperty);
      this.$relationConstraints.push(fixedProperty);

      this._invoke(subQuery, value, fixedProperty);
    });
  }
}
