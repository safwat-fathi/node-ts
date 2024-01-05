import { TDoc } from "@/types/db";
import {
  Collection,
  Connection,
  Document,
  Model,
  Schema,
  FilterQuery,
  Mongoose,
  QueryOptions,
  ProjectionType,
} from "mongoose";

interface IWrite {}

export abstract class BaseRepository<T> {
  // private readonly _collection: Collection<TDoc<T>>;

  private readonly _model: Model<T>;

  constructor(dbClient: Mongoose, collectionName: string) {
    this._model = dbClient.model<T>(collectionName);
  }

  public async find(
    query: FilterQuery<TDoc<T>>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<TDoc<T>>
  ): Promise<any> {
    return await this._model.find(query, projection, options);
  }

  public async findOne(query: any): Promise<any> {
    return await this._model.findOne(query);
  }

  public async create(data: any): Promise<any> {
    const doc = await new this._model(data);

    await doc.save();

    return doc; // or return doc.toObject(); or return doc.toJSON(); or return doc.id; or return doc._id; or return doc.toString(); or return doc.id; or return doc._id; or return doc.toString(); or return doc.id; or return doc._id;
  }

  // public async update(id: string, data: any): Promise<any> {
  //   return await this._collection.findByIdAndUpdate(id, data, { new: true });
  // }

  // public async delete(id: string): Promise<any> {
  //   return await this._collection.findByIdAndDelete(id);
  // }

  public async count(options?: QueryOptions<TDoc<T>>): Promise<number> {
    return await this._model.estimatedDocumentCount(options);
  }
}
