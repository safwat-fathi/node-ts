import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { OrderModel } from "models/orders/orders.model";
import { ProductModel } from "models/products/products.model";
import { Product } from "types/db";
import { ObjectId } from "mongoose";

export const addOrder = async (req: Request, res: Response) => {
  const { products, user, total, address, delivery } = req.body;

  console.log(products);

  try {
    const orderOwner = await UserModel.findOne({ user });

    if (!orderOwner) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    const orderProducts: Product[] = await Promise.all(
      products.map(
        async (item: Promise<{ product: ObjectId; quantity: number }>) =>
          ProductModel.findOne({
            _id: { $in: (await item).product },
          })
            .then(async (doc) => {
              // doc?.stock = doc?.stock - (await item).product;
              await doc?.updateOne({
                stock: doc?.stock - (await item).quantity,
              });

              await doc?.save();
            })
            .catch((err) => {
              res.status(500).json({ message: err });
              return;
            })
      )
    );

    if (orderProducts && orderProducts.length === 0) {
      res.status(404).json({ message: "No products found" });
      return;
    }

    const newOrder = await OrderModel.create({
      user,
      products,
      total,
      address,
      delivery,
    });

    await newOrder.save();

    res
      .status(200)
      .json({ data: newOrder, message: "Order added successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
