import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class TimeStampedEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
