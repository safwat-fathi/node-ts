import { NextFunction, Request, Response } from "express";
// import { UserModel } from "@/models/user/user.model";
// import { OrderModel } from "@/models/orders/orders.model";
// import { ProductModel } from "@/models/products/products.model";
import { Order, User } from "@/types/db";
import { HttpError } from "@/lib/classes/errors/http";
import { asyncHandler } from "@/api/middlewares/async.middleware";
import { UserService } from "@/services/user.service";
import { OrderService } from "@/services/orders.service";
import { ProductService } from "@/services/products.service";
import { ObjectId } from "mongoose";

const userService = new UserService();
const orderService = new OrderService();
const productService = new ProductService();

export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      data: res.locals.dataPaginated.data,
      meta: res.locals.dataPaginated.meta,
      links: res.locals.dataPaginated.links,
    });
  }
);

export const add = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { products, email }: Partial<Order & User> = req.body;

    const orderOwner = await userService.find({ email });

    if (!orderOwner) {
      return new HttpError(400, "No user found, please provide user email");
    }

    for (const i in products) {
      const productId = products[+i].product;
      const qty = products[+i].quantity;

      const product = await productService.find({ id: productId });

      if (!product) {
        return new HttpError(400, "Product not found");
      }

      if (product && product.stock < qty) {
        return new HttpError(
          400,
          `Product ${product.name} does not have enough stock`
        );
      }

      if (product) {
        product.updateOne({ stock: product.stock - qty });

        await product.save();
      }
    }

    const newOrder = await orderService.create({
      user: orderOwner.id,
      products,
      ...req.body,
    });

    // add order to user document
    await orderOwner.updateOne({ $push: { orders: newOrder.id } });
    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  }
);

export const edit = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, ...rest }: Partial<Order & { id: ObjectId }> = req.body;

    if (!id) {
      return new HttpError(400, "Missing order id not found");
    }

    const order = await orderService.update({
      id,
      ...rest,
    });

    if (!order) {
      return next(new HttpError(400, "Order can not be updated"));
    }

    res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });
  }
);

export const remove = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    if (!orderId) {
      return next(new HttpError(400, "Order ID not found"));
    }

    await orderService.delete(<ObjectId>(orderId as unknown));

    res.status(200).json({
      success: true,
      message: "Order deleted",
    });
  }
);
