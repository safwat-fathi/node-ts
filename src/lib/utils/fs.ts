import { PathLike, existsSync } from "fs";

// export const fileExist = async (path: PathLike) =>
//   await stat(path, (err, stats) => {
//     if (err) return false;
//     console.log("🚀 ~ exist ~  stats:", stats.isFile());

//     return stats.isFile();
//   });
export const fileExist = (path: PathLike) => existsSync(path);
