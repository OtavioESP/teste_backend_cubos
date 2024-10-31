import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { TimeStampedEntity } from "../helpers/TimeStampedEntity";
import { Account } from "./account";
import { v4 as uuid } from "uuid";

@Entity("card")
export class Card extends TimeStampedEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  number: string;

  @Column({ length: 3 })
  cvv: string;

  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Column({
    type: "enum",
    enum: ["physical", "virtual"],
  })
  type: "physical" | "virtual";

  constructor() {
    super();
    if (!this.id) {
      this.id = uuid();
    }
  }
}
