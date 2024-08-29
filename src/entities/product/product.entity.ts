import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
