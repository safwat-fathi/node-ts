import {
  ObjectId,
  QuerySelector,
  HydratedDocument,
  FilterQuery,
  SortOrder,
} from "mongoose";

type TDoc<T> = HydratedDocument<T>;

type TFindBy<T> = {
  by: keyof T;
  value: any;
};

type TQuery<T> = FilterQuery<T> & QuerySelector<T>;

const TT: TQuery<Product> = { $gt: 4 };
type TSortBy = { by: string; type: SortOrder };

export interface StoreDB<T> {
  index: (
    skip: number,
    pageSize: number,
    // page: number,
    sort?: TSortBy | null
    // ...args: any
  ) => Promise<[HydratedDocument<T>[], number]>; // return array of T type and count of found data

  find: (
    find: TFindBy<T> | TFindBy<T>[]
  ) => Promise<TDoc<T> | TDoc<T>[] | null>;

  create: (newValue: T) => Promise<TDoc<T>>;

  delete: () => void;
}

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string[];
  orders: ObjectId[];
}
export type UserDoc = TDoc<User>;

export enum SubscriptionType {
  Basic = "basic",
  Silver = "silver",
  Gold = "gold",
}

export interface Subscription {
  type: keyof typeof SubscriptionType;
}
export type SubscriptionDoc = TDoc<Subscription>;

export enum OrderStatus {
  active = "active",
  pending = "pending",
  delivered = "delivered",
  cancelled = "cancelled",
}

export enum ProductImage {
  thumbnail = "thumbnail",
  cover = "cover",
  card = "card",
}

export enum ShopLogo {
  thumbnail = "thumbnail",
  cover = "cover",
}

export interface Product {
  name: string;
  description: string;
  slug: string;
  price: number;
  stock: number;
  images: { type: ProductImage; url: string }[];
  categories: ObjectId[];
}
export type ProductDoc = TDoc<Product>;

export interface Shop {
  name: string;
  slug: string;
  logo: { type: ShopLogo; url: string }[];
  location: [string, string];
}
export type ShopDoc = TDoc<Shop>;

export interface Category {
  name: string;
  description: string;
  sub: ObjectId[] | null;
  parent: ObjectId | null;
}
export type CategoryDoc = TDoc<Category>;

export interface Order {
  user: ObjectId;
  products: { product: ObjectId; quantity: number }[];
  address: string;
  status: OrderStatus;
  delivery: Date;
  total: number;
}
export type OrderDoc = HydratedDocument<Order>;
