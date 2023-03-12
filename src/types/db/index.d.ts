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

  delete(docToDelete: ObjectId): Promise<void>;
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

export enum OrderStatusEnum {
  active = "active",
  confirmed = "confirmed",
  onRoute = "on-route",
  delivered = "delivered",
  cancelled = "cancelled",
  terminated = "terminated",
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
