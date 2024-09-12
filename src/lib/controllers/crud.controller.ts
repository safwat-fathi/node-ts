import { asyncHandler } from "../middlewares/async.middleware";
import { FindOperator } from "typeorm";
import { THttpSuccess } from "@/types/http";
import { NotFoundError } from "../classes/errors/custom";

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

  create = asyncHandler(async (req, res) => {
    const result = await this._service.create(req.body);

    res.status(201).json({ success: true, message: res.__("item-created"), data: result });
  });

  read = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const result = await this._service.read(id);

    if (!result) {
      return next(new NotFoundError(res.__("not-found"), [{ field: "id", value: id }]));
    }

    res.status(200).json({ success: true, message: res.__("item-found"), data: result } satisfies THttpSuccess<T>);
  });

  update = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const result = await this._service.update(id, req.body);

    if (!result) {
      return next(new NotFoundError(res.__("not-found"), [{ field: "id", value: id }]));
    }

    res.status(200).json({ success: true, message: res.__("item-updated"), data: result } satisfies THttpSuccess<T>);
  });

  delete = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const result = await this._service.delete(id);

    if (!result) {
      return next(new NotFoundError(res.__("not-found"), [{ field: "id", value: id }]));
    }

    res.status(200).json({ success: true, message: res.__("item-deleted") } satisfies THttpSuccess);
  });

  list = asyncHandler(async (_, res) => {
    const result = await this._service.list();

    res.status(200).json({ success: true, message: res.__("items-found"), data: result } satisfies THttpSuccess<T[]>);
  });
}

export default CrudController;
