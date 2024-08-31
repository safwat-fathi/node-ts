import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

import {
  Length,
  Min,
  Max,
  IsAlpha,
  IsEmail,
  IsDate,
  IsPhoneNumber,
  IsStrongPassword,
  IsString,
  ValidateIf,
} from "class-validator";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column("varchar")
  @IsString()
  @Length(2, 20)
  @IsAlpha("ar", { message: "Name must be alphabetic" })
  @IsAlpha("en-US", { message: "Name must be alphabetic" })
  name!: string;

  @Column("varchar", { unique: true })
  @Length(2, 100)
  @IsEmail(undefined, { message: "Invalid email" })
  email!: string;

  @Column("varchar")
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @Column("varchar")
  @IsString()
  @ValidateIf((o) => o.password !== o.passwordConfirm, { message: "Passwords do not match" })
  passwordConfirm!: string;

  @Column()
  @IsString()
  gender!: string;

  @Column("date")
  @IsDate()
  @Min(new Date("1900-01-01").getTime())
  @Max(new Date().getTime())
  dob!: Date;

  @Column("varchar", { unique: true })
  @IsPhoneNumber("EG", { message: "Invalid phone number" })
  phone!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
