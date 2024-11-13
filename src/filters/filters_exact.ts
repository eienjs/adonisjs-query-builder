import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type Filter } from '../types.js';

export default class FiltersExact<Model extends LucidModel> implements Filter<Model> {
  public _invoke(query: ModelQueryBuilderContract<Model>, value: unknown, property: string): void {
    // TODO: WORK ON THIS
  }
}
