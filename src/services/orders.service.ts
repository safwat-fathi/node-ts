import mon, { FilterQuery, ObjectId, Types } from "mongoose";
import { OrderModel } from "@/models/orders/orders.model";
import { Order, OrderDoc, OrderStatusEnum, Service, TSortBy } from "@/types/db";

export class OrderService implements Partial<Service<Order>> {
  async index(
    sort?: TSortBy | null | undefined,
    filter?: FilterQuery<OrderDoc>
  ): Promise<Order[]> {
    try {
      let query = null;

      if (!sort) {
        query = OrderModel.find(filter || {});
      } else {
        query = OrderModel.find(
          // filter by model fields
          filter || {},
          // select model fields to return
          null,
          // options (sort, pagination, etc...)
          { sort }
        );
      }

      const orders = await query.exec();

      return orders;
    } catch (err) {
      throw new Error(`OrderService::index::${err}`);
    }
  }

  async indexPaginated(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: FilterQuery<OrderDoc> | null
  ): Promise<[Order[], number]> {
    // convert status filter values to integers to be valid key in aggregate
    if (filter?.status) {
      filter.status = +filter.status;
    }

    // convert user filter value to ObjectId to be valid key in aggregate
    if (filter?.user) {
      filter.user = new Types.ObjectId(filter.user);
    }

    console.log("🚀 ~ filter:", filter);

    try {
      const pipeline: any[] = [
        { $match: filter || {} }, // Match the documents based on the provided filter
        ...(sort ? [{ $sort: sort }] : []), // Apply sorting if the `sort` variable is provided
        {
          $facet: {
            orders: [{ $skip: skip || 0 }, { $limit: pageSize || 10 }],
            count: [{ $count: "total" }],
          },
        }, // Retrieve orders and count
        {
          $project: {
            orders: 1,
            count: { $arrayElemAt: ["$count.total", 0] },
          },
        }, // Restructure the results
      ];

      const [result] = await OrderModel.aggregate(pipeline);

      const { orders, count } = result;

      return [orders, count];
    } catch (err) {
      throw new Error(`OrderService::indexPaginated::${err}`);
    }
  }

  async find(filter: FilterQuery<OrderDoc>): Promise<OrderDoc | null> {
    try {
      const order = await OrderModel.findOne(filter);

      if (!order) {
        return null;
      }

      return order;
    } catch (err) {
      throw new Error(`OrderService::find::${err}`);
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

  async delete(orderId: ObjectId): Promise<void> {
    try {
      const orderToDelete = await OrderModel.findById(orderId);

      if (!orderToDelete) {
        throw new Error(`Order not found`);
      }

      await orderToDelete.deleteOne();
    } catch (err) {
      throw new Error(`OrderService::delete::${err}`);
    }
  }

  async update(o: Partial<Order & { id: ObjectId }>): Promise<OrderDoc | null> {
    const order = await OrderModel.findOneAndUpdate({ _id: o.id }, o, {
      new: true,
    });

    if (!order || order.status !== OrderStatusEnum.Active) {
      return null;
    }

    return order;
  }
}
