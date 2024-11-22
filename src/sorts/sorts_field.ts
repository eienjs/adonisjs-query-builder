import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type Sort } from '../types/main.js';

export default class SortsField<Model extends LucidModel, Result = InstanceType<Model>> implements Sort<Model, Result> {
  public _invoke(query: ModelQueryBuilderContract<Model, Result>, descending: boolean, property: string): void {
    void query.orderBy(property, descending ? 'desc' : 'asc');
  }
}
