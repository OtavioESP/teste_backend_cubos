import { Request, Response } from "express";
import { PeopleServices } from "../services/people/PeopleService";

export class PeopleController {
  private peopleServices = new PeopleServices();

  async login(req: Request, res: Response) {
    const { document, password } = req.body;

    const result = await this.peopleServices.login({ document, password });
    if (result instanceof Error) {
      return res.status(401).json(result.message);
    }

    return res.status(200).json({ token: `Bearer ${result}` });
  }

  async createPerson(req: Request, res: Response) {
    const { name, document, password } = req.body;

    const result = await this.peopleServices.createPeople({
      name,
      document,
      password,
    });

    if (result instanceof Error) {
      return res.status(400).json(result.message);
    }

    return res.status(201).json(result);
  }
}
