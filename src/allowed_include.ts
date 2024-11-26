import { type LucidModel, type ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import { type ExtractModelRelations } from "@adonisjs/lucid/types/relations";
import { type Include } from "./types/main.js";

export default class AllowedInclude<Model extends LucidModel> {
  protected internalName: string;

  protected name: string;

  protected includeClass: Include<Model>;

  public constructor(
    name: string | keyof ExtractModelRelations<InstanceType<Model>>,
    includeClass: Include<Model>,
    internalName?: string | keyof ExtractModelRelations<InstanceType<Model>>,
  ) {
    this.name = name as string;
    this.includeClass = includeClass;
    this.internalName = (internalName ?? name) as string;
  }

  public include(query: ModelQueryBuilderContract<Model>): void {
    // if ('getRequestedFieldsForRelatedTable' in this.includeClass) {
    //   this.includeClass.getRequestedFieldsForRelatedTable = (...args: unknown[]) => {
    //     return query.getRequestedFieldsForRelatedTable(...args);
    //   };
    // }

    this.includeClass._invoke(query, this.internalName);
  }

  public getName(): string {
    return this.name;
  }

  public isForInclude(includeName: string): boolean {
    return this.name === includeName;
  }
}
