import { OrderModel } from "models/orders/orders.model";
import { Order, OrderDoc, Service, TSortBy } from "types/db";

export class ProductService implements Partial<Service<Order>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[Order[], number]> {
    try {
      let query = null;

      // if not pagination its find query
      if (!skip && !pageSize && !sort) {
        query = OrderModel.find(filter);
      } else {
        query = OrderModel.find(
          // filter by model fields (name, price, stock, etc...)
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
      }

      const [orders, count] = await Promise.all([
        query.exec(),
        OrderModel.estimatedDocumentCount(),
      ]);

      return [orders, count];
    } catch (err) {
      throw new Error(`OrderService::index::${err}`);
    }
  }

  async create(newOrder: Order): Promise<OrderDoc> {
    try {
      const order = await OrderModel.create(newOrder);

      await order.save();

      return order;
    } catch (err) {
      throw new Error(`OrderService::create::${err}`);
    }
  }
}
