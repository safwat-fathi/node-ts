import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { OrderModel } from "models/orders/orders.model";
import { ProductModel } from "models/products/products.model";
import { Product } from "types/db";
import { ObjectId } from "mongoose";

export const addOrder = async (req: Request, res: Response) => {
  const { products, user, total, address, delivery } = req.body;

  try {
    const orderOwner = await UserModel.findOne({ user });

    if (!orderOwner) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    const orderProducts: Product[] = products.map(
      async (item: { product: ObjectId; qty: number }) =>
        await ProductModel.find({
          _id: { $in: item.product },
        })
    );

    if (orderProducts && orderProducts.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }
    console.log("orderOwner:", orderOwner);
    console.log("orderProducts:", orderProducts);

    res.status(200).json({ message: "Order added successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
