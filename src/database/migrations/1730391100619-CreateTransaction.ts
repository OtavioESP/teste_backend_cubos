import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransaction1730391100619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transaction",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "value",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "reverted",
            type: "boolean",
            default: false,
          },
          {
            name: "account_id",
            type: "uuid",
          },
          {
            name: "type",
            type: "enum",
            enum: ["deposit", "withdrawal"],
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "fk_transaction_account",
            columnNames: ["account_id"],
            referencedTableName: "account",
            referencedColumnNames: ["id"],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("card");
  }
}
