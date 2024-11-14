import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';

export type EnumValues<T> = T[keyof T];

export interface Filter<Model extends LucidModel, Result = InstanceType<Model>> {
  _invoke(query: ModelQueryBuilderContract<Model, Result>, value: StrictValuesWithoutRaw, property: string): void;
}

export interface Sort<Model extends LucidModel, Result = InstanceType<Model>> {
  _invoke(query: ModelQueryBuilderContract<Model, Result>, descending: boolean, property: string): void;
}
