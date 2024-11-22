import { type LucidModel } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types/main.js';
import FiltersPartial from './filters_partial.js';

export default class FiltersEndsWithStrict<Model extends LucidModel, Result = InstanceType<Model>>
  extends FiltersPartial<Model, Result>
  implements Filter<Model, Result>
{
  protected getWhereParameters(value: StrictValuesWithoutRaw | null): [boolean, string] {
    return [true, `%${value}`];
  }
}
