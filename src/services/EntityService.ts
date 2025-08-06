import { modelRegistry } from "../models/registry";
import { BaseModel } from "../models/BaseModel";

export default class EntityService {
  get models() {
    return Object.keys(modelRegistry).map((name) => ({
      name,
      url: `/entity/${name}`
    }));
  }

  model<T extends BaseModel>(name: string) {
    const ModelClass = modelRegistry[name];
    if (!ModelClass) throw new Error(`Model "${name}" not found`);
    return ModelClass as new () => T;
  }
}
