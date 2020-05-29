import { Table, Column, Model, Unique } from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @Unique
  @Column
  public email: string;

  @Column
  public password: string;
}
