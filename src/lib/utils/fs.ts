import { PathLike, existsSync } from "fs";

export const fileExist = (path: PathLike) => existsSync(path);
