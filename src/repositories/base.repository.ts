import { MongooseDB } from "@/config/db.config";
import { TDoc } from "@/types/db";
import {
  Model,
  FilterQuery,
  QueryOptions,
  ProjectionType,
  UpdateQuery,
  Schema,
} from "mongoose";

// export interface IWrite<T> {
//   create(item: T): Promise<TDoc<T>>;
//   update(id: string, item: UpdateQuery<T>): Promise<TDoc<T> | null>;
//   delete(id: string): Promise<boolean>;
// }

// export interface IRead<T> {
//   find(
//     query: FilterQuery<TDoc<T>>,
//     projection?: ProjectionType<T> | null,
//     options?: QueryOptions<TDoc<T>>
//   ): Promise<TDoc<T>[]>;
//   findOne(query: FilterQuery<TDoc<T>>): Promise<TDoc<T> | null>;
// }

// export abstract class BaseRepository<T> implements IRead<T>, IWrite<T> {
export abstract class BaseRepository<T> {
  private readonly _db: MongooseDB;
  public readonly _model: Model<T>;

  constructor(collectionName: string, schema: Schema<T>) {
    this._db = MongooseDB.getInstance();
    this._model = this._db.connection.model<T>(collectionName, schema);

    this._init();
  }

  private _init() {
    (async () => await this._db.connect())();
  }

  // public async find(
  //   query: FilterQuery<TDoc<T>>,
  //   projection?: ProjectionType<T> | null,
  //   options?: QueryOptions<TDoc<T>>
  // ): Promise<TDoc<T>[]> {
  //   return await this._model.find(query, projection, options);
  // }

  // public async findOne(query: FilterQuery<TDoc<T>>): Promise<TDoc<T> | null> {
  //   return await this._model.findOne(query);
  // }

  protected async create(item: T): Promise<TDoc<T>> {
    const doc = await new this._model(item);

    await doc.save();

    return doc; // or return doc.toObject(); or return doc.toJSON(); or return doc.id; or return doc._id; or return doc.toString(); or return doc.id; or return doc._id; or return doc.toString(); or return doc.id; or return doc._id;
  }

  protected async update(
    id: string,
    item: UpdateQuery<T>
  ): Promise<TDoc<T> | null> {
    throw new Error("Method not implemented");
  }

  protected async delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }

  protected async find(
    query: FilterQuery<TDoc<T>>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<TDoc<T>>
  ): Promise<TDoc<T>[]> {
    throw new Error("Method not implemented");
  }

  protected async findOne(
    query: FilterQuery<TDoc<T>>
  ): Promise<TDoc<T> | null> {
    throw new Error("Method not implemented");
  }

  // public async count(options?: QueryOptions<TDoc<T>>): Promise<number> {
  //   throw new Error("Method not implemented")
  // }

  // public async update(id: string, item: UpdateQuery<T>): Promise<TDoc<T> | null> {
  //   return await this._model.findByIdAndUpdate(id, item, { new: true });
  // }

  // public async delete(id: string): Promise<TDoc<T> | null> {
  //   return await this._model.findByIdAndDelete(id);
  // }

  // public async count(options?: QueryOptions<TDoc<T>>): Promise<number> {
  //   return await this._model.estimatedDocumentCount(options);
  // }
}
