import { type LucidModel, type ModelAttributes, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { Collection } from 'collect.js';
import { type EFilterOperator } from './enums/filter_operator.js';
import FiltersBeginsWithStrict from './filters/filters_begins_with_strict.js';
import FiltersCallback from './filters/filters_callback.js';
import FiltersEndsWithStrict from './filters/filters_ends_with_strict.js';
import FiltersExact from './filters/filters_exact.js';
import FiltersOperator from './filters/filters_operator.js';
import FiltersPartial from './filters/filters_partial.js';
import FiltersTrashed from './filters/filters_trashed.js';
import QueryBuilderRequest from './query_builder_request.js';
import { type Filter } from './types/main.js';

export default class AllowedFilter<Model extends LucidModel> {
  protected internalName: string;

  protected ignored: Collection<unknown>;

  protected defaultValue?: StrictValuesWithoutRaw | null;

  protected _hasDefaultValue = false;

  protected nullable = false;

  protected name: string;

  protected filterClass: Filter<Model>;

  public constructor(
    name: string | keyof ModelAttributes<InstanceType<Model>>,
    filterClass: Filter<Model>,
    internalName?: keyof ModelAttributes<InstanceType<Model>>,
  ) {
    this.name = name as string;
    this.filterClass = filterClass;
    this.ignored = new Collection();
    this.internalName = (internalName ?? name) as string;
  }

  public filter(query: ModelQueryBuilderContract<Model>, value: unknown): void {
    const valueToFilter = this.resolveValueForFiltering(value);

    if (!this.nullable && valueToFilter === null) {
      return;
    }

    this.filterClass._invoke(query, valueToFilter, this.internalName);
  }

  public getFilterClass(): Filter<Model> {
    return this.filterClass;
  }

  public getName(): string {
    return this.name;
  }

  public isForFilter(filterName: string): boolean {
    return this.name === filterName;
  }

  public ignore(...values: unknown[]): this {
    this.ignored = this.ignored.merge(values).flatten();

    return this;
  }

  public getIgnored(): unknown[] {
    return this.ignored.toArray();
  }

  public getInternalName(): string {
    return this.internalName;
  }

  public setDefaultValue(value: StrictValuesWithoutRaw | null): this {
    this._hasDefaultValue = true;
    this.defaultValue = value;

    if (value === null) {
      this.setNullable(true);
    }

    return this;
  }

  public getDefaultValue(): StrictValuesWithoutRaw | null | undefined {
    return this.defaultValue;
  }

  public hasDefaultValue(): boolean {
    return this._hasDefaultValue;
  }

  public setNullable(nullable = true): this {
    this.nullable = nullable;

    return this;
  }

  public unsetDefaultValue(): this {
    this._hasDefaultValue = false;
    this.defaultValue = undefined;

    return this;
  }

  protected resolveValueForFiltering(value: unknown): StrictValuesWithoutRaw | null {
    if (Array.isArray(value)) {
      const remainingProperties = value.map((subValue) => this.resolveValueForFiltering(subValue));

      return remainingProperties.length === 0 ? null : (remainingProperties as StrictValuesWithoutRaw);
    }

    return this.ignored.contains(value) ? null : (value as StrictValuesWithoutRaw);
  }

  public static setFilterArrayValueDelimiter(delimiter?: string): void {
    if (delimiter) {
      QueryBuilderRequest.setFilterArrayValueDelimiter(delimiter);
    }
  }

  public static exact<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersExact(addRelationConstraint), internalName);
  }

  public static partial<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersPartial(addRelationConstraint), internalName);
  }

  public static beginsWithStrict<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersBeginsWithStrict(addRelationConstraint), internalName);
  }

  public static endsWithStrict<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersEndsWithStrict(addRelationConstraint), internalName);
  }

  public static callback<T extends LucidModel>(
    name: string,
    callback: (query: ModelQueryBuilderContract<T>, value: StrictValuesWithoutRaw | null, property: string) => void,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersCallback(callback), internalName);
  }

  public static trashed<T extends LucidModel>(
    name = 'trashed',
    internalName?: keyof ModelAttributes<InstanceType<T>>,
  ): AllowedFilter<T> {
    return new this(name, new FiltersTrashed(), internalName);
  }

  public static custom<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    filterClass: Filter<T>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, filterClass, internalName);
  }

  public static operator<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    filterOperator: EFilterOperator,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    this.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new this(name, new FiltersOperator(addRelationConstraint, filterOperator), internalName);
  }
}
