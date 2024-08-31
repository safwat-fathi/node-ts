import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Category } from "./category.entity";
import { IsInt, Length, Min, Max, IsAlpha, IsNumber } from "class-validator";

@Entity()
export class Product {
	@PrimaryGeneratedColumn("increment")
	id!: string;

	@Column()
	@Length(2, 20)
	@IsAlpha("ar", { message: "Name must be alphabetic" })
	@IsAlpha("en-US", { message: "Name must be alphabetic" })
	name!: string;

	@Column("text")
	@Length(2, 200)
	description!: string;

	@Column("decimal")
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(1000000)
	price!: number;

	@Column()
	@IsInt()
	@Min(0)
	@Max(1000000)
	quantity!: number;

	@ManyToMany(type => Category, category => category.products, {
		cascade: true,
	})
	categories!: Category[];
}
