import { Table, Column, Model } from "sequelize-typescript";

@Table
export class Product extends Model<Product> {
  @Column
  public title: string;

  @Column
  public desc: string;

  @Column
  public image: string;

  @Column
  public price: number;

  @Column
  public type: string;

  @Column
  public quantity: number;
}
