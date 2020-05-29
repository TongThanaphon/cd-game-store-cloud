import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";

import { User } from "../../user/models/User";

@Table
export class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @Column
  public uid: number;

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  public pids: number[];

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  public quantities: number[];

  @Column
  public status: string;
}
