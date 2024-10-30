import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { TimeStampedEntity } from "../helpers/TimeStampedEntity";

@Entity("people")
export class People extends TimeStampedEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column()
  password: string;

  constructor() {
    super();
    if (!this.id) {
      this.id = uuid();
    }
  }
}
