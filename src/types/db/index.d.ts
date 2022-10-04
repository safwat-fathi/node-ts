import { ObjectId, Document } from "mongoose";

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

export enum ProductImage {
  thumbnail = "thumbnail",
  cover = "cover",
  card = "card",
}

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: { type: ProductImage; url: string }[];
  categories: ObjectId[];
  size?: string;
  color?: string;
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
  delivery: Date;
  total: number;
}
