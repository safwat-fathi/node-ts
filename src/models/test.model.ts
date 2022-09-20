import { model } from "mongoose";
import { Test } from "types/db";
import { testSchema } from "./test.schema";

export const TestModel = model<Test>("Test", testSchema);
