import { type ApplicationService } from '@adonisjs/core/types';

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    qualifyColumn(column: string): string;
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    qualifyColumn(column: string): string;
  }
}

export default class AdonisjsQueryBuilderProvider {
  public constructor(protected app: ApplicationService) {}

  public async boot(): Promise<void> {
    await import('../extensions/model_query_builder.js');
  }
}
