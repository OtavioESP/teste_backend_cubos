import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("people")
export class People {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
