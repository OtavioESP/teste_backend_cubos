import express from "express";
import AppDataSource from "./index";
import { routes } from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados inicializado!");
  })
  .catch((error) => {
    console.error("Erro ao iniciar o Banco de Dados:", error);
  });

app.listen(3000, () => console.log("Servidor rodando!"));
