import { type LucidModel, type ModelAttributes, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValuesWithoutRaw } from '@adonisjs/lucid/types/querybuilder';
import { Collection } from 'collect.js';
import FiltersExact from './filters/filters_exact.js';
import FiltersPartial from './filters/filters_partial.js';
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
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersExact(addRelationConstraint), internalName);
  }

  public static partial<T extends LucidModel>(
    name: string | keyof ModelAttributes<InstanceType<T>>,
    internalName?: keyof ModelAttributes<InstanceType<T>>,
    addRelationConstraint = true,
    arrayValueDelimiter?: string,
  ): AllowedFilter<T> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersPartial(addRelationConstraint), internalName);
  }

  // public static beginsWithStrict(string $name, $internalName = null, bool $addRelationConstraint = true, string $arrayValueDelimiter = null): static
  // {
  //     static::setFilterArrayValueDelimiter($arrayValueDelimiter);

  //     return new static($name, new FiltersBeginsWithStrict($addRelationConstraint), $internalName);
  // }

  // public static endsWithStrict(string $name, $internalName = null, bool $addRelationConstraint = true, string $arrayValueDelimiter = null): static
  // {
  //     static::setFilterArrayValueDelimiter($arrayValueDelimiter);

  //     return new static($name, new FiltersEndsWithStrict($addRelationConstraint), $internalName);
  // }

  // public static callback(string $name, $callback, $internalName = null, string $arrayValueDelimiter = null): static
  // {
  //     static::setFilterArrayValueDelimiter($arrayValueDelimiter);

  //     return new static($name, new FiltersCallback($callback), $internalName);
  // }

  // public static trashed(string $name = 'trashed', $internalName = null): static
  // {
  //     return new static($name, new FiltersTrashed(), $internalName);
  // }

  // public static custom(string $name, Filter $filterClass, $internalName = null, string $arrayValueDelimiter = null): static
  // {
  //     static::setFilterArrayValueDelimiter($arrayValueDelimiter);

  //     return new static($name, $filterClass, $internalName);
  // }

  // public static operator(string $name, FilterOperator $filterOperator, string $boolean = 'and', ?string $internalName = null, bool $addRelationConstraint = true, string $arrayValueDelimiter = null): self
  // {
  //     static::setFilterArrayValueDelimiter($arrayValueDelimiter);

  //     return new static($name, new FiltersOperator($addRelationConstraint, $filterOperator, $boolean), $internalName, $filterOperator);
  // }
}
