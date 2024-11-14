import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';
import FiltersExact from './filters_exact.js';

export default class FiltersPartial<Model extends LucidModel, Result = InstanceType<Model>>
  extends FiltersExact<Model, Result>
  implements Filter<Model, Result>
{
  public _invoke(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw,
    property: string,
  ): void {
    if (this.$addRelationConstraint && this.isRelationProperty(query, property)) {
      this.withRelationConstraint(query, value, property);

      return;
    }

    const wrappedProperty = query.qualifyColumn(property);

    if (Array.isArray(value)) {
      if (value.filter((item) => item.toString().length > 0).length === 0) {
        return;
      }

      void query.where((subQuery) => {
        for (const partialValue of value.filter((item) => item.toString().length > 0)) {
          const [subSensitive, subExpresion] = this.getWhereParameters(partialValue);
          const subMethod = subSensitive ? subQuery.orWhereLike : subQuery.orWhereILike;
          void subMethod(wrappedProperty, subExpresion);
        }
      });

      return;
    }

    const [sensitive, expresion] = this.getWhereParameters(value);
    const method = sensitive ? query.whereLike : query.whereILike;
    void method(wrappedProperty, expresion);
  }

  protected getWhereParameters(value: StrictValuesWithoutRaw): [boolean, string] {
    return [false, `%${value}%`];
  }
}
