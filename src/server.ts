import express from "express";
import AppDataSource from "./index";

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

app.listen(3000, () => console.log("app runing"));
