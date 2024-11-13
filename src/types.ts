import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

export interface Filter<Model extends LucidModel> {
  _invoke(query: ModelQueryBuilderContract<Model>, value: unknown, property: string): void;
}
