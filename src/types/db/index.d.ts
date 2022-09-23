import { ObjectId } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  subscription: ObjectId;
}

export enum Subscription {
  basic = "basic",
  silver = "silver",
  gold = "gold",
}

export interface Product {
  name: string;
  description: string;
  inStock: number;
  images: { type: "thumbnail" | "cover" | "card"; url: string }[];
  category: ObjectId[];
  size?: string;
  color?: string;
}
