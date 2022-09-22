import { ObjectId } from "mongoose";

enum TestEnum {
  Value_1 = "Value_1",
  Value_2 = "Value_2",
}

export interface Test {
  propOne: string;
  propTwo: number;
  propThree?: TestEnum;
}

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
