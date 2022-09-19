import { model } from "mongoose";
import { Test } from "types/db.types";
import { testSchema } from "./test.schema";

export const TestModel = model<Test>("Test", testSchema);
