import { type } from "os";

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
  roles: {
    type: string;
    ref: string;
  }[];
}

export interface Role {
  name: "user" | "moderator" | "admin";
}
