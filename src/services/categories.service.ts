import { CategoryModel } from "@/models/categories/categories.model";
import { ObjectId } from "mongoose";
import { Category, CategoryDoc, Service, TSortBy } from "@/types/db";

export class CategoryService implements Partial<Service<Category>> {
  async index(
    skip?: number | null,
    pageSize?: number | null,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[CategoryDoc[], number]> {
    try {
      let query = null;

      // if not pagination its find query
      if (!skip && !pageSize && !sort) {
        query = CategoryModel.find(filter);
      } else {
        query = CategoryModel.find(
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
          .limit(pageSize || 10)
          .populate("sub");
        // .select("name description");
      }

      const [categories, count] = await Promise.all([
        query.exec(),
        CategoryModel.estimatedDocumentCount(),
      ]);

      return [categories, count];
    } catch (err) {
      throw new Error(`CategoryService::index::${err}`);
    }
  }

  async create(newCategory: Category): Promise<CategoryDoc> {
    try {
      const { name } = newCategory;

      // check if already exist
      const foundCategory = await CategoryModel.findOne({ name });

      if (foundCategory) {
        throw new Error(`Category ${name} already exists`);
      }

      const category = await new CategoryModel(newCategory);

      await category.save();

      return category;
    } catch (err) {
      throw new Error(`CategoryService::create::${err}`);
    }
  }

  async update(category: Category): Promise<CategoryDoc> {
    try {
      const { name } = category;

      const updatedCategory = await CategoryModel.findOneAndUpdate(
        { name },
        category,
        { returnOriginal: false, upsert: false }
      );

      if (!updatedCategory) {
        throw new Error(`Category ${name} update failed`);
      }

      return updatedCategory;
    } catch (err) {
      throw new Error(`CategoryService::update::${err}`);
    }
  }

  async delete(categoryId: ObjectId): Promise<void> {
    try {
      const categoryToDelete = await CategoryModel.findById(categoryId);

      if (!categoryToDelete) {
        throw new Error(`Category not found`);
      }

      await categoryToDelete.remove();
    } catch (err) {
      throw new Error(`CategoryService::delete::${err}`);
    }
  }
}
