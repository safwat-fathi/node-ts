import { ObjectId, HydratedDocument, FilterQuery, SortOrder } from "mongoose";

export type TDoc<T> = HydratedDocument<T>;

export type TSortOrder = SortOrder;

export type TSortBy = { by: string; type: SortOrder };

export interface Service<T> {
  index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[T[], number]>; // return array of T type and count of found data

  create(newDoc: T): Promise<TDoc<T>>;

  update(docToUpdate: Partial<T & { id: ObjectId }>): Promise<TDoc<T> | null>;

  delete(docId: ObjectId): Promise<void>;
}

export interface User {
  name: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  isVerified: boolean;
  phone: string;
  address: string[];
  orders: ObjectId[];
}
export type UserDoc = TDoc<User>;

export enum SubscriptionType {
  Basic,
  Silver,
  Gold,
}

export interface Token {
  userId: ObjectId;
  token: string;
}
export type TokenDoc = TDoc<Token>;

export interface Subscription {
  type: keyof typeof SubscriptionType;
}
export type SubscriptionDoc = TDoc<Subscription>;

export enum OrderStatusEnum {
  Active,
  Confirmed,
  OnRoute,
  Delivered,
  Cancelled,
  Terminated,
}

export enum ProductImage {
  Thumbnail,
  Cover,
  Card,
}

export enum ShopLogo {
  Thumbnail,
  Cover,
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
