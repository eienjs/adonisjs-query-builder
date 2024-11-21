import { type Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import { Collection } from 'collect.js';

export default class QueryBuilderRequest {
  protected static includesArrayValueDelimiter = ',';

  protected static appendsArrayValueDelimiter = ',';

  protected static fieldsArrayValueDelimiter = ',';

  protected static sortsArrayValueDelimiter = ',';

  protected static filterArrayValueDelimiter = ',';

  private constructor(private readonly _request: Request) {}

  public static setArrayValueDelimiter(delimiter: string): void {
    QueryBuilderRequest.filterArrayValueDelimiter = delimiter;
    QueryBuilderRequest.includesArrayValueDelimiter = delimiter;
    QueryBuilderRequest.appendsArrayValueDelimiter = delimiter;
    QueryBuilderRequest.fieldsArrayValueDelimiter = delimiter;
    QueryBuilderRequest.sortsArrayValueDelimiter = delimiter;
  }

  public static fromRequest(request: Request): QueryBuilderRequest {
    return new QueryBuilderRequest(request);
  }

  public includes(): Collection<unknown> {
    const includeParameterName = app.config.get<string>('querybuilder.parameters.include', 'include');

    let includeParts = this.getRequestData(includeParameterName, {});

    if (typeof includeParts === 'string') {
      includeParts = includeParts.split(QueryBuilderRequest.includesArrayValueDelimiter);
    }

    return new Collection(includeParts).filter();
  }

  public appends(): Collection<unknown> {
    const appendParameterName = app.config.get<string>('querybuilder.parameters.append', 'append');

    let appendParts = this.getRequestData(appendParameterName, {});

    if (typeof appendParts === 'string') {
      appendParts = appendParts.split(QueryBuilderRequest.appendsArrayValueDelimiter);
    }

    return new Collection(appendParts).filter();
  }

  public fields(): unknown[] {
    // TODO: handle correct return fields
    return [];
  }

  public sorts(): Collection<unknown> {
    const sortParameterName = app.config.get<string>('querybuilder.parameters.sort', 'sort');

    let sortParts = this.getRequestData(sortParameterName, {});

    if (typeof sortParts === 'string') {
      sortParts = sortParts.split(QueryBuilderRequest.sortsArrayValueDelimiter);
    }

    return new Collection(sortParts).filter();
  }

  public filters(): Collection<unknown> {
    const filterParameterName = app.config.get<string>('querybuilder.parameters.filter', 'filter');

    const filterParts = this.getRequestData(filterParameterName, {});

    if (typeof filterParts === 'string') {
      return new Collection();
    }

    const filters = new Collection(filterParts);

    return filters.map((value) => {
      return this.getFilterValue(value);
    });
  }

  protected getFilterValue(value: unknown): unknown {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      return '';
    }

    if (Array.isArray(value) || typeof value === 'object') {
      return new Collection(value)
        .map((valueValue) => {
          return this.getFilterValue(valueValue);
        })
        .all();
    }

    if (typeof value === 'string' && value.includes(QueryBuilderRequest.filterArrayValueDelimiter)) {
      return value.split(QueryBuilderRequest.filterArrayValueDelimiter);
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  }

  protected getRequestData<T = unknown>(key: string, defaultValue?: T): T {
    return this._request.input(key, defaultValue) as T;
  }
}
