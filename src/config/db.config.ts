// import fs from "fs";
import mongoose, { Connection, Mongoose } from "mongoose";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenv.config();
dotenvExpand.expand(dotenv.config());

// const ca = fs.readFileSync(`<path to CA certificate>`);
// const cert = fs.readFileSync(`<path to public client certificate>`);
// const key = fs.readFileSync(`<path to private client key>`);

const { MONGO_URI_DEV, MONGO_URI_PROD, NODE_ENV } = process.env || {
  MONGO_URI_DEV: "",
  MONGO_URI_PROD: "",
  NODE_ENV: "development",
};

export const MONGO_URI =
  NODE_ENV === "development" ? MONGO_URI_DEV : MONGO_URI_PROD;

mongoose.set("debug", NODE_ENV === "development" ? true : false);
mongoose.set("strictQuery", false);
// mongoose.set("strictPopulate", false);

export const connectDB = (): Promise<any> =>
  new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI);

    const db: Connection = mongoose.connection;

    db.on("error", error => {
      console.log(`Error connecting to database`);
      reject(error);
    });

    db.on("disconnected", () => {
      console.log(`Database disconnected`);
    });

    db.once("open", () => {
      console.log(`Connected to database successfully`);
      resolve(mongoose);
    });
  });

export const disconnectDB = (): Promise<void> => mongoose.connection.close();

export interface DBConnection<T> {
  connect: () => Promise<T>;
  disconnect: () => Promise<void>;
}

export class MongooseDB implements DBConnection<Mongoose> {
  private static instance: MongooseDB;
  private _mongoose: Mongoose;
  private _connection: Connection;

  private constructor() {
    this._mongoose = mongoose;
    this._connection = this._mongoose.connection;
    this._configureDB();
  }

  public static getInstance(): MongooseDB {
    if (!MongooseDB.instance) {
      MongooseDB.instance = new MongooseDB();
    }

    return MongooseDB.instance;
  }

  private _configureDB() {
    this._mongoose.set("debug", NODE_ENV === "development" ? true : false);
    this._mongoose.set("strictQuery", false);
    // this._mongoose.set("strictPopulate", false);
  }

  public async connect(): Promise<Mongoose> {
    // mongoose is connected
    if (this._mongoose.connection.readyState === 1)
      return Promise.resolve(this._mongoose);

    // mongoose is connecting
    if (this._mongoose.connection.readyState === 2)
      return new Promise(resolve => {
        this._mongoose.connection.on("connected", () => {
          resolve(this._mongoose);
        });
      });

    // mongoose is not connected
    return new Promise((resolve, reject) => {
      this._mongoose.connect(MONGO_URI);

      this._connection.on("error", error => {
        console.log("Error connecting to database");
        reject(error);
      });

      this._connection.on("disconnected", () => {
        console.log("Database disconnected");
      });

      this._connection.once("open", () => {
        console.log("Connected to database successfully");
        resolve(this._mongoose);
      });
    });
  }

  public async disconnect(force?: boolean): Promise<void> {
    return await this._mongoose.connection.close(force);
  }

  public get client(): Mongoose {
    return this._mongoose;
  }

  public get connection(): Connection {
    return this._connection;
  }
}

// * in case of using postgreSQL
// import {
//   createConnection,
//   Connection,
//   getConnectionManager,
//   ConnectionOptions,
// } from "typeorm";
// import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// interface DbConnection {
//   connect: () => Promise<Connection>;
//   disconnect: () => Promise<void>;
// }

// class PostgreSQLConnection implements DbConnection {
//   private connection: Connection | undefined;

//   private options: PostgresConnectionOptions = {
//     type: "postgres",
//     host: process.env.PG_HOST || "localhost",
//     port: parseInt(process.env.PG_PORT || "5432", 10),
//     username: process.env.PG_USER || "your_username",
//     password: process.env.PG_PASSWORD || "your_password",
//     database: process.env.PG_DATABASE || "your_database",
//     synchronize: true,
//     logging: true,
//     entities: [
//       /* your entity classes go here */
//     ],
//   };

//   public async connect(): Promise<Connection> {
//     if (this.connection) {
//       return this.connection;
//     }

//     this.connection = await createConnection(this.options as ConnectionOptions);
//     return this.connection;
//   }

//   public async disconnect(): Promise<void> {
//     if (this.connection) {
//       await this.connection.close();
//       this.connection = undefined;
//       console.log("Disconnected from the PostgreSQL database");
//     }
//   }
// }

// export default PostgreSQLConnection;
