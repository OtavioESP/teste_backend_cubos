import AppDataSource from "../..";
import { Repository } from "typeorm";
import { Account } from "../../entities/account";
import { People } from "../../entities/people";
import {
  CreateAccountRequest,
  CreateAccountResponse,
  ListAccountRequest,
  ListAccountResponse,
} from "./types";

export class AccountService {
  private accountRepository = AppDataSource.getRepository(Account);

  private checkAccountMask(account: string): boolean {
    const regex = /^\d{7}-\d{1}$/;
    return regex.test(account);
  }

  async createAccount({
    branch,
    account,
    ownerId,
  }: CreateAccountRequest): Promise<CreateAccountResponse | Error> {
    if (branch.length !== 3) {
      return new Error("Branch deve apenas conter 3 digitos!");
    }

    if (!this.checkAccountMask(account)) {
      return new Error("A conta deve estar no padrão XXXXXXX-X!");
    }

    if (await this.accountRepository.findOne({ where: { account: account } })) {
      return new Error("Uma conta ja existe com este valor!");
    }

    const personRepository = AppDataSource.getRepository(People);
    const owner = await personRepository.findOne({
      where: { id: ownerId },
    });

    const newAccount = this.accountRepository.create({
      branch,
      account,
      owner,
    });
    await this.accountRepository.save(newAccount);

    const newAccountResponse: CreateAccountResponse = {
      id: newAccount.id,
      branch: newAccount.branch,
      account: newAccount.account,
      createdAt: newAccount.createdAt,
      updatedAt: newAccount.updatedAt,
    };

    return newAccountResponse;
  }

  async listAllAccountsByOwner({
    ownerId,
  }: ListAccountRequest): Promise<ListAccountResponse[] | Error> {
    const accounts = await this.accountRepository.find({
      where: { owner: { id: ownerId } },
    });

    const accountsResponse = accounts.map(({ amount, ...rest }) => rest);

    return accountsResponse;
  }

  async getBallance(accountId: string): Promise<number | Error> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      return new Error("Conta inexistente!");
    }

    return Math.abs(account.amount);
  }
}
