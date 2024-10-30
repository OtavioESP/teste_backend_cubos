import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { People } from "./people";
import { TimeStampedEntity } from "../helpers/TimeStampedEntity";

@Entity("account")
export class Account extends TimeStampedEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  branch: number;

  @Column()
  account: string;

  @ManyToOne(() => People)
  @JoinColumn({ name: "owner_id" })
  owner: string;

  constructor() {
    super();
    if (!this.id) {
      this.id = uuid();
    }
  }
}
