import { ObjectId } from "mongodb";

export interface BaseEntity {
  _id?: ObjectId;
  _createdAt?: Date;
  _updatedAt?: Date;
  _createdBy?: string;
  _version?: number;
}
