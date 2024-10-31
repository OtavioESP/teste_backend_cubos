import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/AuthenticatedRequest";
import { CardService } from "../services/card/CardService";

export class CardController {
  private cardService = new CardService();

  async createCard(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const { type, number, cvv } = req.body;

    const result = await this.cardService.createCard({
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
    const results = await this.cardService.listAllCardsByAccount({
      accountId,
    });

    if (results instanceof Error) {
      return res.status(400).json(results.message);
    }
    return res.status(200).json(results);
  }

  async listPeopleCards(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user["id"];
    const currentPage = parseInt(req.query.currentPage as string, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

    const result = await this.cardService.listAllCardsByUser({
      ownerId,
      currentPage,
      itemsPerPage,
    });

    if (result instanceof Error) {
      return res.status(500).json(result.message);
    }

    return res.status(200).json(result);
  }
}
