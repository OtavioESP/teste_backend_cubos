import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCard1730325903549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "card",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "number",
            type: "varchar",
          },
          {
            name: "cvv",
            type: "varchar",
            length: "3",
          },
          {
            name: "account_id",
            type: "uuid",
          },
          {
            name: "type",
            type: "enum",
            enum: ["physical", "virtual"],
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
            name: "fk_card_account",
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
