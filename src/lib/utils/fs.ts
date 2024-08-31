import { PathLike, existsSync } from "fs";

export const fileExist = (path: PathLike | string) => existsSync(path);
