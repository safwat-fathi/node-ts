// import { NextFunction, Request, Response } from "express";
// import { Service, TSortBy } from "@/types/db";
// import { asyncHandler } from "./async.middleware";
// // import { createHash } from "crypto";
// import { HttpError } from "@/lib/classes/errors/http";
// import { processQuery } from "@/lib/utils/mongoose";

// export const paginate = <T>(index: Service<T>["indexPaginated"]) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { skip, limit, page, sort, filter } = {
//       ...req.query,
//     } as {
//       skip: string;
//       limit: string;
//       page: string;
//       filter: any | null;
//       sort: any | null;
//     };
//     // process filter to match mongo query operators
//     const filterQueryProcessed = processQuery(filter);

//     const PAGE_SIZE = +limit || 10;
//     const SKIP = +skip || (+page - 1) * PAGE_SIZE;

//     // convert sort values to integers to be valid key in aggregate
//     if (sort) Object.keys(sort).forEach(key => (sort[key] = +sort[key]));

//     const [data, count] = await index(
//       SKIP,
//       PAGE_SIZE,
//       sort,
//       filterQueryProcessed
//     );

//     const current_page = +page || 1;
//     const total_pages = Math.ceil(count / PAGE_SIZE);
//     const has_next = +page < total_pages;
//     const nextPage = has_next ? +page + 1 : null;
//     const has_previous = +page > 1;
//     const previousPage = has_previous ? +page - 1 : null;

//     if (current_page <= 0) {
//       next(new HttpError(404, `Page requested not valid or no page provided`));
//     }

//     if (current_page > total_pages) {
//       next(
//         new HttpError(
//           404,
//           `Page requested not found, current total pages is: ${total_pages}`
//         )
//       );
//     }

//     // hashing data to help client-side identify data has changed
//     // if (data) {
//     //   const data_stringified = JSON.stringify(data);
//     //   const data_hash = createHash("md5")
//     //     .update(data_stringified)
//     //     .copy()
//     //     .digest("hex");

//     // 		next();
//     // 	}

//     const meta = {
//       current_page,
//       total_pages,
//       has_previous,
//       previous: previousPage,
//       has_next,
//       next: nextPage,
//       // hash: data_hash,
//     };

//     res.locals.dataPaginated = { data, meta, links: {} };
//     // res.locals.dataPaginated = { data: "No data found" };

//     next();
//   });
