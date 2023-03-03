import { CategoryModel } from "models/categories/categories.model";
import { Category, CategoryDoc, Service, TSortBy } from "types/db";

export class CategoryService implements Partial<Service<Category>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[CategoryDoc[], number]> {
    try {
      const query = CategoryModel.find(
        // filter by model fields
        filter || {},
        // select model fields to return
        null,
        // options (sort, pagination, etc...)
        {
          ...(sort && {
            sort,
          }),
        }
      )
        .skip(skip || 0)
        .limit(pageSize || 10);

      const [categories, count] = await Promise.all([
        query.exec(),
        CategoryModel.estimatedDocumentCount(),
      ]);

      return [categories, count];
    } catch (err) {
      throw new Error(`CategoryService::index::${err}`);
    }
  }

  async find(
    // find: TFindBy<Category> | TFindBy<Category>[]
    find: any
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
      throw new Error(`CategoryService::find::${err}`);
    }
  }
}
