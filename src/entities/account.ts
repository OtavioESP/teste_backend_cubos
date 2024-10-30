import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { People } from "./people";
import { TimeStampedEntity } from "../helpers/TimeStampedEntity";

@Entity("account")
export class Account extends TimeStampedEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  branch: string;

  @Column()
  account: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  amount: number;

  @ManyToOne(() => People, (people) => people.id)
  @JoinColumn({ name: "owner_id" })
  owner: People;

  constructor() {
    super();
    if (!this.id) {
      this.id = uuid();
    }
  }
}
