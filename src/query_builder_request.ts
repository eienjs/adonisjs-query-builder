import { type Request } from '@adonisjs/core/http';
import config from '@adonisjs/core/services/config';

export default class QueryBuilderRequest {
  private constructor(private readonly _request: Request) {}

  public static fromRequest(request: Request): QueryBuilderRequest {
    return new QueryBuilderRequest(request);
  }

  public includes(): unknown[] {
    const includeParameterName = config.get<string>('querybuilder.parameters.include', 'include');
    let includeParts = this.getRequestData(includeParameterName, []);
    if (!Array.isArray(includeParts)) {
      includeParts = [includeParts];
    }

    return includeParts.filter(Boolean);
  }

  public appends(): unknown[] {
    const appendParameterName = config.get<string>('querybuilder.parameters.append', 'append');
    let appendParts = this.getRequestData(appendParameterName, []);
    if (!Array.isArray(appendParts)) {
      appendParts = [appendParts];
    }

    return appendParts.filter(Boolean);
  }

  protected getRequestData<T = unknown>(key: string, defaultValue?: T): T {
    return (this._request.qs()[key] ?? defaultValue) as T;
  }
}
