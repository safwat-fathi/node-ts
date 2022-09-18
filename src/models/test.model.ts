import { model } from "mongoose";
import { Test } from "types/db.types";
import { testSchema } from "./test.schema";

const Test = model<Test>("Test", testSchema);
