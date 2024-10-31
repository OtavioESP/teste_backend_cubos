import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/AuthenticatedRequest";
import { TransactionServices } from "../services/transaction/TransactionService";

export class TransactionController {
  private transactionService = new TransactionServices();

  async createAccountTransaction(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const { value, description } = req.body;

    const result = await this.transactionService.createRawTransaction({
      value: parseFloat(value),
      description,
      accountId,
    });

    if (result instanceof Error) {
      return res.status(400).json(result.message);
    }

    return res.status(200).json(result);
  }

  async createTransferTransaction(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const { value, description, receiverAccountId } = req.body;

    const result = await this.transactionService.createTransferTransaction({
      receiverAccountId,
      originalAccountId: accountId,
      value: parseFloat(value),
      description,
    });

    if (result instanceof Error) {
      return res.status(400).json(result.message);
    }

    return res.status(200).json(result);
  }

  async listAllAccountTransactions(req: AuthenticatedRequest, res: Response) {
    const { accountId } = req.params;
    const type = req.query.type;
    const currentPage = parseInt(req.query.currentPage as string, 10) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string, 10) || 10;

    const result = await this.transactionService.listAllAccountTransactions({
      accountId,
      type,
      currentPage,
      itemsPerPage,
    });

    if (result instanceof Error) {
      return res.status(500).json(result.message);
    }

    return res.status(200).json(result);
  }

  async revertTransactions(req: AuthenticatedRequest, res: Response) {
    const { accountId, transactionId } = req.params;

    const result = await this.transactionService.revertTransactions({
      accountId,
      transactionId,
    });

    if (result instanceof Error) {
      return res.status(500).json(result.message);
    }

    return res.status(200).json(result);
  }
}
