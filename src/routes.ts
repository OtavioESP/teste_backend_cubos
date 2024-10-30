import { Router, Request, Response } from "express";
import { PeopleController } from "./controllers/people/PeopleController";

const routes = Router();
const peopleController = new PeopleController();

routes.post("/people", (req, res) => {
  peopleController.createPerson(req, res);
});

export { routes };
