import { ObjectId, Document } from "mongoose";

export interface StoreDB<T> {
  index: (
    skip: number | null,
    limit: number | null,
    page: number,
    ...args: any
  ) => Promise<{
    data: T[];
    meta: { current_page: number; total_pages: number; hash: string };
  }>;
}

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  subscription: ObjectId;
  orders: ObjectId[];
}

export interface Subscription extends Document {
  name: "basic" | "silver" | "gold";
}

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

export interface Product extends Document {
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

export interface Shop extends Document {
  name: string;
  slug: string;
  logo: { type: ShopLogo; url: string }[];
  location: [string, string];
}

export interface Category extends Document {
  name: string;
  description: string;
  sub: ObjectId[] | null;
  parent: ObjectId | null;
}

export interface Order extends Document {
  user: ObjectId;
  products: { product: ObjectId; quantity: number }[];
  address: string;
  status: OrderStatus;
  delivery: Date;
  total: number;
}
