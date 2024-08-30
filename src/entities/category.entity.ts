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

	@ManyToMany(type => Product, product => product.categories)
	products!: Product[];
}
