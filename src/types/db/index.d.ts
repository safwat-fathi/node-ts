import { ObjectId } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  subscription: ObjectId;
  orders: ObjectId[];
}

export interface Subscription {
  name: "basic" | "silver" | "gold";
}

export enum ProductImage {
  thumbnail = "thumbnail",
  cover = "cover",
  card = "card",
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: { type: ProductImage; url: string }[];
  categories: ObjectId[];
  size?: string;
  color?: string;
}

export interface Category {
  name: string;
  description: string;
  sub: ObjectId[] | null;
  parent: ObjectId | null;
}

export interface Order {
  user: ObjectId;
  products: { product: ObjectId; qty: number }[];
  address: string;
  delivery: Date;
  total: number;
}
