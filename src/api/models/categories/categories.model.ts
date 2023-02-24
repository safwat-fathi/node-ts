import { Document, model } from "mongoose";
import { Category, CategoryDoc, StoreDB, TFindBy, TSortBy } from "types/db";
import { categorySchema } from "./categories.schema";

export const CategoryModel = model<CategoryDoc>("Category", categorySchema);

export class CategoryStore implements Partial<StoreDB<Category>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null
  ): Promise<[CategoryDoc[], number]> {
    try {
      const [categories, count] = await Promise.all([
        CategoryModel.find(
          // filters by model props (name, price, etc...)
          {},
          null,
          // options (sort, pagination, etc...)
          {
            ...(sort && {
              sort: { [sort.by]: sort.type },
            }),
          }
        )
          .skip(skip || 0)
          .limit(pageSize || 10),
        CategoryModel.estimatedDocumentCount(),
      ]);

      return [categories, count];
    } catch (err) {
      throw new Error(`CategoryStore::index::${err}`);
    }
  }

  async find(
    find: TFindBy<Category> | TFindBy<Category>[]
  ): Promise<CategoryDoc | CategoryDoc[] | null> {
    try {
      let categories: CategoryDoc | CategoryDoc[] | null = [];

      if (Array.isArray(find)) {
        let query: any = [];

        for (let i in find) {
          query = [...query, { [String(find[i].by)]: find[i].value }];
        }

        categories = await CategoryModel.find({
          $or: query,
        });
      } else {
        categories = await CategoryModel.findOne({
          [String(find.by)]: find.value,
        });
      }

      if (!categories) {
        return null;
      }

      return categories;
    } catch (err) {
      throw new Error(`CategoryStore::find::${err}`);
    }
  }
}
