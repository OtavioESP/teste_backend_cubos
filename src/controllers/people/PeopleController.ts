import { Request, Response } from "express";
import { PeopleServices } from "../../services/people/PeopleService";

export class PeopleController {
  private peopleServices: PeopleServices;

  constructor() {
    this.peopleServices = new PeopleServices();
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

    delete result.password;
    return res.status(201).json(result);
  }
}
