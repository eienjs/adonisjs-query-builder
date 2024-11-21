import { type Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import { Collection } from 'collect.js';

export default class QueryBuilderRequest {
  private constructor(private readonly _request: Request) {}

  public static fromRequest(request: Request): QueryBuilderRequest {
    return new QueryBuilderRequest(request);
  }

  public includes(): unknown[] {
    const includeParameterName = app.config.get<string>('querybuilder.parameters.include', 'include');
    let includeParts = this.getRequestData(includeParameterName, []);
    if (!Array.isArray(includeParts)) {
      includeParts = [includeParts];
    }

    return includeParts.filter(Boolean);
  }

  public appends(): unknown[] {
    const appendParameterName = app.config.get<string>('querybuilder.parameters.append', 'append');
    let appendParts = this.getRequestData(appendParameterName, []);
    if (!Array.isArray(appendParts)) {
      appendParts = [appendParts];
    }

    return appendParts.filter(Boolean);
  }

  public fields(): unknown[] {
    // TODO: handle correct return fields
    return [];
  }

  public sorts(): unknown[] {
    const sortParameterName = app.config.get<string>('querybuilder.parameters.sort', 'sort');
    let sortParts = this.getRequestData(sortParameterName, []);
    if (!Array.isArray(sortParts)) {
      sortParts = [sortParts];
    }

    return sortParts.filter(Boolean);
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
