import { DataSource } from "typeorm";
import { People } from "./entities/people";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "admin",
  database: "banco_financeiro",
  synchronize: false,
  logging: false,
  entities: [People],
  migrations: ["src/database/migrations/*{.ts,.js}"],
});

export default AppDataSource;
