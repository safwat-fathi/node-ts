import { ObjectId, Document } from "mongoose";

export interface StoreDB<T> {
  index: (
    skip: number | null,
    limit: number | null,
    page: number,
    sort?: { by: string; type: "ascend" | "descend" }
    // ...args: any
  ) => Promise<{
    data: T[];
    meta?: { current_page: number; total_pages: number; hash: string };
  }>;

  find: (find: {
    by: { [key in keyof T]: string };
    value: any;
  }) => Promise<{ data: T | T[] } | null>;

  delete: () => void;
}

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  subscription: ObjectId;
  orders: ObjectId[];
}
export interface UserDoc extends User, Document {}

export interface Subscription {
  name: "basic" | "silver" | "gold";
}
export interface SubscriptionDoc extends Subscription, Document {}

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
  size?: string;
  color?: string;
}
export interface ProductDoc extends Product, Document {}

export interface Shop {
  name: string;
  slug: string;
  logo: { type: ShopLogo; url: string }[];
  location: [string, string];
}
export interface ShopDoc extends Shop, Document {}

export interface Category {
  name: string;
  description: string;
  sub: ObjectId[] | null;
  parent: ObjectId | null;
}
export interface CategoryDoc extends Category, Document {}

export interface Order {
  user: ObjectId;
  products: { product: ObjectId; quantity: number }[];
  address: string;
  status: OrderStatus;
  delivery: Date;
  total: number;
}
export interface OrderDoc extends Document, Order {}
