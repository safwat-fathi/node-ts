import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Product {
	@PrimaryGeneratedColumn("increment")
	id!: string;

	@Column()
	name!: string;

	@Column("text")
	description!: string;

	@Column("decimal")
	price!: number;

	@Column()
	quantity!: number;

	@ManyToMany(type => Category, category => category.products, {
		cascade: true,
	})
	categories!: Category[];
}
