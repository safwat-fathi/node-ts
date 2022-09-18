enum TestEnum {
  Value_1 = "Value_1",
  Value_2 = "Value_2",
}

export interface Test {
  propOne: string;
  propTwo: number;
  propThree?: TestEnum;
}
