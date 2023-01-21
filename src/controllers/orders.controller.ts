import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { OrderModel } from "models/orders/orders.model";
import { ProductModel } from "models/products/products.model";
import { Product, Order } from "types/db";
import { HttpError } from "errors/http";
import { asyncHandler } from "middlewares/async.middleware";
// import { ObjectId } from "mongoose";

export const addOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { products, user }: Order = req.body;

    const orderOwner = await UserModel.findOne({ user });

    if (!orderOwner) {
      return new HttpError(404, "No user found");
    }

    let orderTotal = 0;

    for (const i in products) {
      const productId = products[i].product;
      const qty = products[i].quantity;
      const product: Product | null = await ProductModel.findOne({
        _id: productId,
      });

      if (!product) {
        return new HttpError(404, "Product not found");
      }

      if (product && product.stock < qty) {
        return new HttpError(
          400,
          `Product ${product.name} does not have enough stock`
        );
      }

      if (product) {
        orderTotal += product.price;
        product.updateOne({ stock: product.stock - qty });

        await product.save();
      }
    }

    // if (orderTotal !== total) {
    // 	res.status(400).json({
    // 		message: `Order total is not correct`,
    // 	});
    // 	return false;
    // }

    const newOrder = await OrderModel.create({
      user,
      products,
      total: orderTotal,
      ...req.body,
    });

    // add order to user document
    await orderOwner.updateOne({ $push: { orders: newOrder.id } });
    await newOrder.save();

    res.status(200).json({
      success: true,
      data: newOrder,
    });
  }
);
