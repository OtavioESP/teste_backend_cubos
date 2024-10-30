import "dotenv/config";
import { DataSource } from "typeorm";
import { People } from "./entities/people";
import { Account } from "./entities/account";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [People, Account],
  migrations: ["src/database/migrations/*{.ts,.js}"],
});

export default AppDataSource;
