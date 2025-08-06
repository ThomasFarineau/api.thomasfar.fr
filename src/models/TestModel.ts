import { Model } from "./registry";
import { BaseModel } from "./BaseModel";

@Model("test")
export default class TestModel extends BaseModel {
  name?: string;

  value?: number;

  constructor(data?: Partial<TestModel>) {
    super(data);
    Object.assign(this, data);
  }
}
