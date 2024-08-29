import CrudController from "@/lib/controllers/crud.controller";
import { ProductService } from "@/services/product.service";

const productController = new CrudController(new ProductService());

export default productController;
