import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/AuthenticatedRequest";
import { CardService } from "../services/card/CardService";

export class CardController {
  private cardServices: CardService;

  constructor() {
    this.cardServices = new CardService();
  }

  async createCard(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const { type, number, cvv } = req.body;

    const result = await this.cardServices.createCard({
      type,
      number,
      cvv,
      accountId,
    });

    if (result instanceof Error) {
      return res.status(400).json(result.message);
    }

    return res.status(201).json(result);
  }

  async listAccountCards(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const results = await this.cardServices.listAllCardsByAccount({
      accountId,
    });

    if (results instanceof Error) {
      return res.status(400).json(results.message);
    }
    return res.status(200).json(results);
  }

  async listPeopleCards(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user["id"];
  }
}
