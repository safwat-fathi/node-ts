import { ObjectId, HydratedDocument, FilterQuery, SortOrder } from "mongoose";

export type TDoc<T> = HydratedDocument<T>;

export type TSortOrder = SortOrder;

type TSortBy = { by: string; type: SortOrder };

export interface Service<T> {
  index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[T[], number]>; // return array of T type and count of found data

  create(newDoc: T): Promise<TDoc<T>>;

  update(docToUpdate: T): Promise<TDoc<T>>;

  delete(docId: ObjectId): Promise<void>;
}

export interface User {
  name: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  phone: string;
  address: string[];
  orders: ObjectId[];
}
export type UserDoc = TDoc<User>;

export enum SubscriptionType {
  Basic = 0,
  Silver = 1,
  Gold = 2,
}

export interface Subscription {
  type: keyof typeof SubscriptionType;
}
export type SubscriptionDoc = TDoc<Subscription>;

export enum OrderStatusEnum {
  Active = 1,
  Confirmed = 2,
  OnRoute = 3,
  Delivered = 4,
  Cancelled = 5,
  Terminated = 6,
}

export enum ProductImage {
  Thumbnail = 1,
  Cover = 2,
  Card = 3,
}

export enum ShopLogo {
  Thumbnail = 1,
  Cover = 2,
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
  status: OrderStatusEnum;
  delivery: Date;
  total: number;
}
export type OrderDoc = HydratedDocument<Order>;

export interface Review {
  title: string;
  comment: string;
  user: ObjectId;
  product: ObjectId;
  rating: number;
}
export type ReviewDoc = HydratedDocument<Review>;
