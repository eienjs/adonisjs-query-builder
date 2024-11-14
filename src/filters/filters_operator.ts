import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type EFilterOperator, FilterOperator } from '../enums/filter_operator.js';
import { type Filter } from '../types.js';
import { substrReplace } from '../utils/helpers.js';
import FiltersExact from './filters_exact.js';

export default class FiltersOperator<Model extends LucidModel, Result = InstanceType<Model>>
  extends FiltersExact<Model, Result>
  implements Filter<Model, Result>
{
  public constructor(
    protected readonly $addRelationConstraint: boolean,
    protected readonly $filterOperator: EFilterOperator,
  ) {
    super($addRelationConstraint);
  }

  public _invoke(
    query: ModelQueryBuilderContract<Model, Result>,
    value: StrictValuesWithoutRaw,
    property: string,
  ): void {
    let filterOperator = this.$filterOperator;
    if (this.$addRelationConstraint && this.isRelationProperty(query, property)) {
      this.withRelationConstraint(query, value, property);

      return;
    }

    if (Array.isArray(value)) {
      void query.where((subQuery) => {
        for (const item of value) {
          this._invoke(subQuery, item, property);
        }
      });

      return;
    }

    let copyValue = value;
    if (this.$filterOperator === FilterOperator.Dynamic) {
      filterOperator = this.getDynamicFilterOperator(copyValue.toString());
      copyValue = this.removeDynamicFilterOperatorFromValue(copyValue.toString(), filterOperator);
    }

    void query.where(query.qualifyColumn(property), filterOperator, copyValue);
  }

  protected getDynamicFilterOperator(value: string): EFilterOperator {
    let filterOperator: EFilterOperator = FilterOperator.Equal;
    for (const filterOperatorCase of Object.values(FilterOperator)) {
      if (value.startsWith(filterOperatorCase) && filterOperatorCase !== FilterOperator.Dynamic) {
        filterOperator = filterOperatorCase;
      }
    }

    return filterOperator;
  }

  protected removeDynamicFilterOperatorFromValue(value: string, filterOperator: EFilterOperator): string {
    if (value.includes(filterOperator)) {
      value = substrReplace(value, '', 0, filterOperator.length);
    }

    return value;
  }
}
