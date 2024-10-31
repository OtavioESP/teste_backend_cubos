import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TimeStampedEntity } from "../helpers/TimeStampedEntity";
import { Account } from "./account";
import { v4 as uuid } from "uuid";

@Entity("transaction")
export class Transaction extends TimeStampedEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @Column()
  reverted: boolean;

  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Column({
    type: "enum",
    enum: ["deposit", "withdrawal"],
  })
  type: "deposit" | "withdrawal";

  constructor() {
    super();
    if (!this.id) {
      this.id = uuid();
    }
  }
}
