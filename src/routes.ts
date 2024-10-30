import { Router, Request, Response } from "express";
import { PeopleController } from "./controllers/people/PeopleController";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import { AccountController } from "./controllers/account/AccountController";

const routes = Router();
const peopleController = new PeopleController();
const accountController = new AccountController();

routes.post("/people", (req, res) => {
  peopleController.createPerson(req, res);
});
routes.post("/login", (req, res) => {
  peopleController.login(req, res);
});
routes.get("/people/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acesso permitido a rota protegida!" });
});

routes.post("/accounts", authMiddleware, (req, res) => {
  accountController.createAccount(req, res);
});
routes.get("/accounts", authMiddleware, (req, res) => {
  accountController.listPersonAccounts(req, res);
});

export { routes };
