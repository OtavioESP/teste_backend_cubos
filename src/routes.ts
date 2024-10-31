import { Router } from "express";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import { PeopleController } from "./controllers/PeopleController";
import { AccountController } from "./controllers/AccountController";
import { CardController } from "./controllers/CardController";

const routes = Router();
const peopleController = new PeopleController();
const accountController = new AccountController();
const cardController = new CardController();

routes.post("/people", (req, res) => {
  peopleController.createPerson(req, res);
});
routes.post("/login", (req, res) => {
  peopleController.login(req, res);
});

// ROTA DE VALIDACAO DO JWT
routes.get("/people/protected", authMiddleware, (req, res) => {
  res.json({ message: "Acesso permitido a rota protegida!" });
});

routes.post("/accounts", authMiddleware, (req, res) => {
  accountController.createAccount(req, res);
});
routes.get("/accounts", authMiddleware, (req, res) => {
  accountController.listPersonAccounts(req, res);
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

// routes.get("/accounts/:accountId/cards", authMiddleware, async (req, res) => {
//   const { accountId } = req.params;
//   const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
//   const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 records per page

//   try {
//     const [cards, total] = await cardRepository.findAndCount({
//       where: { account: { id: accountId } },
//       take: limit,
//       skip: (page - 1) * limit,
//     });

//     const totalPages = Math.ceil(total / limit);

//     res.json({
//       data: cards,
//       page,
//       totalPages,
//       totalItems: total,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while retrieving cards." });
//   }
// });

export { routes };
