import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "../middlewares/async.middleware";
import { FindOperator } from "typeorm";

export interface CrudService<T> {
	create(item: T): Promise<T>;
	read(id: string | FindOperator<string>): Promise<T | null>;
	update(id: string | FindOperator<string>, item: T): Promise<T | null>;
	delete(id: string | FindOperator<string>): Promise<T | null>;
	list(): Promise<T[]>;
}

class CrudController<T, S extends CrudService<T>> {
	protected _service: S;

	constructor(_service: S) {
		this._service = _service;
	}

	async create() {
		return asyncHandler(async (req, res) => {
			const result = await this._service.create(req.body);

			res
				.status(201)
				.json({ success: true, message: "Item created", data: result });
		});
	}

	async read() {
		return asyncHandler(async (req, res, next) => {
			const id = req.params.id;
			const result = await this._service.read(id);

			if (!result) {
				return next(new HttpError(404, "Item not found"));
			}

			res
				.status(200)
				.json({ success: true, message: "Item found", data: result });
		});
	}

	async update() {
		return asyncHandler(async (req, res, next) => {
			const id = req.params.id;

			const result = await this._service.update(id, req.body);

			if (!result) {
				return next(new HttpError(404, "Item not found"));
			}

			res
				.status(200)
				.json({ success: true, message: "Item updated", data: result });
		});
	}

	async delete() {
		return asyncHandler(async (req, res, next) => {
			const id = req.params.id;
			const result = await this._service.delete(id);

			if (!result) {
				return next(new HttpError(404, "Item not found"));
			}

			res.status(200).json({ success: true, message: "Item deleted" });
		});
	}

	async list() {
		return asyncHandler(async (req, res) => {
			const result = await this._service.list();

			res
				.status(200)
				.json({ success: true, message: "Items found", data: result });
		});
	}
}

export default CrudController;
