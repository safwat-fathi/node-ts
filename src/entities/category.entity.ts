import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column()
  name!: string;

  @Column("text")
  description!: string;

  @ManyToMany(() => Product, (product_id) => product_id.categories)
  products!: Product[];
}
