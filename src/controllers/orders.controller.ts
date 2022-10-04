import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { OrderModel } from "models/orders/orders.model";
import { ProductModel } from "models/products/products.model";
import { Product, User } from "types/db";
import { ObjectId } from "mongoose";

export const addOrder = async (req: Request, res: Response) => {
  const {
    products,
    user,
  }: { products: { product: ObjectId; quantity: number }[]; user: User } =
    req.body;

  try {
    const orderOwner = await UserModel.findOne({ user });

    if (!orderOwner) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    for (let i in products) {
      const productId = products[i].product;
      const qty = products[i].quantity;

      const product: Product | null = await ProductModel.findOne({
        _id: productId,
      });

      if (!product) {
        res.status(404).json({
          message: `Product not found`,
        });
        return false;
      }

      if (product && product.stock < qty) {
        res.status(400).json({
          message: `Product ${product.name} does not have enough stock`,
        });
        return false;
      }

      if (product) {
        product.updateOne({ stock: product.stock - qty });

        await product.save();
      }
    }

    const newOrder = await OrderModel.create({
      user,
      products,
      ...req.body,
    });

    await newOrder.save();

    res
      .status(200)
      .json({ data: newOrder, message: "Order added successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
