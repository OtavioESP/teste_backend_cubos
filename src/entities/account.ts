import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { People } from "./people";

// TODO: Implementar a TimeStampedClass
// extends TimeStampedClass
@Entity("account")
export class Account {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  branch: number;

  @Column()
  account: string;

  @ManyToOne(() => People)
  @JoinColumn({ name: "owner_id" })
  owner: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
