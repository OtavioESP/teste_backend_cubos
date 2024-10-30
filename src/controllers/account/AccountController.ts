import { Response } from "express";
import { AccountService } from "../../services/account/AccountService";
import { AuthenticatedRequest } from "../../middlewares/AuthenticatedRequest";

type AccountResponse = {
  id: string;
  branch: string;
  account: string;
  createdAt: Date;
  updatedAt: Date;
};

export class AccountController {
  private accountServices: AccountService;

  constructor() {
    this.accountServices = new AccountService();
  }

  async createAccount(req: AuthenticatedRequest, res: Response) {
    const { branch, account } = req.body;
    const ownerId = req.user["id"];

    const result = await this.accountServices.createAccount({
      branch,
      account,
      ownerId,
    });

    if (result instanceof Error) {
      return res.status(400).json(result.message);
    }

    const response: AccountResponse = {
      id: result.id,
      branch: result.branch,
      account: result.account,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
    return res.status(200).json(response);
  }

  async listPersonAccounts(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user["id"];

    const results = await this.accountServices.listAllAccountsByOwner({
      ownerId,
    });

    if (results instanceof Error) {
      return res.status(400).json(results.message);
    }

    return res.status(200).json(results);
  }
}
