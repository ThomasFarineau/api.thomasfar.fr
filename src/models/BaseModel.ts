import { BaseEntity } from "@helpers/types/BaseEntity";

export interface User extends BaseEntity {
  name: string;
  email: string;
}
