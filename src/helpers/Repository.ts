import { connectToDB } from "@helpers/db";
import { BaseEntity } from "@helpers/types/BaseEntity";
import { Collection, Filter, ObjectId, OptionalUnlessRequiredId, WithId } from "mongodb";

export class Repository<T extends BaseEntity> {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  public async findAll(): Promise<WithId<T>[]> {
    const col = await this.collection();
    return col.find({}).toArray();
  }

  public async findById(id: string): Promise<WithId<T> | null> {
    const col = await this.collection();
    return col.findOne({
      _id: new ObjectId(id)
    } as Filter<T>);
  }

  public async findOne(query: { filter: Filter<T> }): Promise<WithId<T> | null> {
    const col = await this.collection();
    return col.findOne(query);
  }

  public async count(query: Filter<T> = {}): Promise<number> {
    const col = await this.collection();
    return col.countDocuments(query);
  }

  public async exists(id: string): Promise<boolean> {
    const col = await this.collection();
    const count = await col.countDocuments({
      _id: new ObjectId(id)
    } as Filter<T>);
    return count > 0;
  }

  public async find(
    query: Filter<T> = {},
    options: { limit?: number; skip?: number } = {}
  ): Promise<WithId<T>[]> {
    const col = await this.collection();
    return col
      .find(query)
      .limit(options.limit || 0)
      .skip(options.skip || 0)
      .toArray();
  }

  public async create(
    doc: Omit<
      T,
      "_id" | "_createdAt" | "_updatedAt" | "_createdBy" | "_version"
    >,
    createdBy?: string
  ): Promise<WithId<T>> {
    const col = await this.collection();
    const now = new Date();
    const entity: T = {
      ...doc,
      _createdAt: now,
      _updatedAt: now,
      _createdBy: createdBy,
      _version: 1
    } as T;
    const res = await col.insertOne(entity as OptionalUnlessRequiredId<T>);
    return {
      _id: res.insertedId,
      ...entity
    } as WithId<T>;
  }

  public async update(
    id: string,
    update: Partial<T>,
    updatedBy?: string
  ): Promise<boolean> {
    const col = await this.collection();
    const now = new Date();

    const updateFields: any = {
      ...update,
      _updatedAt: now,
      ...(updatedBy
        ? {
          _createdBy: updatedBy
        }
        : {}),
      $inc: {
        _version: 1
      }
    };

    // $set ne supporte pas $inc, donc séparer les opérations
    const res = await col.updateOne(
      {
        _id: new ObjectId(id)
      } as Filter<T>,
      [
        {
          $set: {
            ...update,
            _updatedAt: now,
            ...(updatedBy
              ? {
                _createdBy: updatedBy
              }
              : {})
          }
        },
        {
          $set: {
            _version: {
              $add: ["$_version", 1]
            }
          }
        } // pour MongoDB >= 5
      ]
    );

    return res.modifiedCount > 0;
  }

  public async delete(id: string): Promise<boolean> {
    const col = await this.collection();
    const res = await col.deleteOne({
      _id: new ObjectId(id)
    } as Filter<T>);
    return res.deletedCount > 0;
  }

  private async collection(): Promise<Collection<T>> {
    const db = await connectToDB();
    return db.collection<T>(this.collectionName);
  }
}
