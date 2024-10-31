import "dotenv/config";
import { DataSource } from "typeorm";
import { People } from "./entities/people";
import { Account } from "./entities/account";
import { Card } from "./entities/card";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from "./config/constants";

const AppDataSource = new DataSource({
  type: "postgres",
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT),
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [People, Account, Card],
  migrations: ["src/database/migrations/*{.ts,.js}"],
});

export default AppDataSource;
