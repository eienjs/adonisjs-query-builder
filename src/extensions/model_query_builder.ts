import { ModelQueryBuilder } from '@adonisjs/lucid/orm';

ModelQueryBuilder.macro('qualifyColumn', function (this: ModelQueryBuilder, column: string) {
  if (column.includes('.')) {
    return column;
  }

  return `${this.model.table}.${column}`;
});
