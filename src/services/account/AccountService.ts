import AppDataSource from "../..";
import { Repository } from "typeorm";
import { Account } from "../../entities/account";
import { People } from "../../entities/people";

type CreateAccountRequest = {
  branch: string;
  account: string;
  ownerId: string;
};

type ListAccountRequest = {
  ownerId: string;
};

type ListAccountResponse = {
  id: string;
  branch: string;
  account: string;
  owner: People;
  createdAt: Date;
  updatedAt: Date;
};

export class AccountService {
  private accountRepository: Repository<Account>;

  constructor() {
    this.accountRepository = AppDataSource.getRepository(Account);
  }

  private checkAccountMask(account: string): boolean {
    const regex = /^\d{7}-\d{1}$/;
    return regex.test(account);
  }

  async createAccount({
    branch,
    account,
    ownerId,
  }: CreateAccountRequest): Promise<Account | Error> {
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

    return newAccount;
  }

  async listAllAccountsByOwner({
    ownerId,
  }: ListAccountRequest): Promise<ListAccountResponse[] | Error> {
    const accounts = await this.accountRepository.find({
      where: { owner: { id: ownerId } },
    });

    if (!accounts) {
      return new Error("Não existem vinculos!");
    }

    const accountsWithoutAmount = accounts.map(({ amount, ...rest }) => rest);

    return accountsWithoutAmount;
  }
}
