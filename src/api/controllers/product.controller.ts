import { Product } from "@/entities/product.entity";
import { HttpError } from "@/lib/classes/errors/http";
import CrudController from "@/lib/controllers/crud.controller";
import { asyncHandler } from "@/lib/middlewares/async.middleware";
import { ProductService } from "@/services/product.service";

const productService = new ProductService();

class ProductController extends CrudController<Product, ProductService> {
	constructor() {
		super(productService);
	}

	async getProductByCategory() {
		return asyncHandler(async (req, res) => {
			const categoryId = req.params.categoryId;
			const result = await this._service.listByCategory(categoryId);

			res
				.status(201)
				.json({ success: true, message: "Item found", data: result });
		});
	}

	async search() {
		return asyncHandler(async (req, res) => {
			const term = req.query.term as string;
			const field = req.query.field as string;

			if (!term || !field) {
				return new HttpError(400, "Missing search term or field");
			}

			const result = await this._service.search(term, field);

			res
				.status(200)
				.json({ success: true, message: "Items found", data: result });
		});
	}
}

export default ProductController;
