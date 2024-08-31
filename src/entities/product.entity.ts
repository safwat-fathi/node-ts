import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from "typeorm";
import { Category } from "./category.entity";
import { IsInt, Length, Min, Max, IsAlpha, IsNumber } from "class-validator";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column("varchar")
  @Length(2, 20)
  @IsAlpha("ar", { message: "Name must be alphabetic" })
  @IsAlpha("en-US", { message: "Name must be alphabetic" })
  name!: string;

  @Column("text", { nullable: true })
  @Length(2, 200)
  description!: string;

  @Column("decimal", { default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000000)
  price!: number;

  @Column("int", { default: 0 })
  @IsInt()
  @Min(0)
  @Max(1000000)
  quantity!: number;

  @ManyToMany(() => Category, (category_id) => category_id.products, {
    cascade: true,
  })
  categories!: Category[];
}
