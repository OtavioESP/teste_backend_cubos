import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccount1730215209718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "account",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "branch",
            type: "numeric",
          },
          {
            name: "account",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "owner_id",
            type: "uuid",
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
            name: "fk_account_owner",
            columnNames: ["owner_id"],
            referencedTableName: "people",
            referencedColumnNames: ["id"],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("account");
  }
}
