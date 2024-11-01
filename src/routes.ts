import { Router } from "express";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import { PeopleController } from "./controllers/PeopleController";
import { AccountController } from "./controllers/AccountController";
import { CardController } from "./controllers/CardController";
import { TransactionController } from "./controllers/TransactionController";

const routes = Router();
const peopleController = new PeopleController();
const accountController = new AccountController();
const cardController = new CardController();
const transactionController = new TransactionController();

routes.post("/people", (req, res) => {
  peopleController.createPerson(req, res);
});
routes.post("/login", (req, res) => {
  peopleController.login(req, res);
});

// ROTA DE VALIDACAO DO JWT
routes.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acesso permitido a rota protegida!" });
});

routes.post("/accounts", authMiddleware, (req, res) => {
  accountController.createAccount(req, res);
});
routes.get("/accounts", authMiddleware, (req, res) => {
  accountController.listPersonAccounts(req, res);
});
routes.get("/accounts/:accountId/balance", authMiddleware, (req, res) => {
  accountController.getAccountBalance(req, res);
});

routes.post("/accounts/:accountId/cards", authMiddleware, (req, res) => {
  cardController.createCard(req, res);
});
routes.get("/accounts/:accountId/cards", authMiddleware, (req, res) => {
  cardController.listAccountCards(req, res);
});
routes.get("/cards", authMiddleware, (req, res) => {
  cardController.listPeopleCards(req, res);
});

routes.get("/accounts/:accountId/transactions", authMiddleware, (req, res) => {
  transactionController.listAllAccountTransactions(req, res);
});
routes.post("/accounts/:accountId/transactions", authMiddleware, (req, res) => {
  transactionController.createAccountTransaction(req, res);
});
routes.post(
  "/accounts/:accountId/transactions/:transactionId/revert",
  authMiddleware,
  (req, res) => {
    transactionController.revertTransactions(req, res);
  },
);
routes.post(
  "/accounts/:accountId/transactions/internal",
  authMiddleware,
  (req, res) => {
    transactionController.createTransferTransaction(req, res);
  },
);

export { routes };
