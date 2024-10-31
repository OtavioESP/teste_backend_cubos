import { Repository } from "typeorm";
import AppDataSource from "../..";
import { Account } from "../../entities/account";
import { Transaction } from "../../entities/transaction";
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  CreateTransferTransactionRequest,
  listAllAccountTransactionsRequest,
  RevertTransactionRequest,
} from "./type";

export class TransactionServices {
  private transactionRepository = AppDataSource.getRepository(Transaction);
  private accountRepository = AppDataSource.getRepository(Account);

  private async effectTransaction(
    account: Account,
    value: number,
    type: "deposit" | "withdrawal",
  ): Promise<boolean | Error> {
    try {
      if (type === "withdrawal") {
        account.amount = account.amount - Math.abs(value);
      } else {
        account.amount = Math.abs(account.amount) + Math.abs(value);
      }
      console.log(account);
      await this.accountRepository.save(account);
      return true;
    } catch (error) {
      return new Error(error.message);
    }
  }

  private async createTransaction(
    type: "deposit" | "withdrawal",
    description: string,
    value: number,
    account: Account,
  ): Promise<Transaction | Error> {
    try {
      const newTransaction = this.transactionRepository.create({
        type,
        description,
        value,
        account,
      });

      await this.transactionRepository.save(newTransaction);

      return newTransaction;
    } catch (error) {
      return new Error(error.message);
    }
  }

  private validateAccountTransaction(account: Account, value: number): boolean {
    return !(account.amount - Math.abs(value) < 0);
  }

  async createRawTransaction({
    value,
    description,
    accountId,
  }: CreateTransactionRequest): Promise<CreateTransactionResponse | Error> {
    let type: "deposit" | "withdrawal";

    if (value < 0) {
      type = "withdrawal";
    } else if (value > 0) {
      type = "deposit";
    } else {
      return new Error("A transação não pode ter valor 0!");
    }

    const transactionAccount = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (
      type === "withdrawal" &&
      !this.validateAccountTransaction(transactionAccount, value)
    ) {
      return new Error("Conta possui saldo insuficiente para essa retirada!");
    }

    // Esse bloco simplesmente cria a trnasação, e depois insere o valor na conta
    const result = await this.createTransaction(
      type,
      description,
      value,
      transactionAccount,
    );

    if (result instanceof Error) {
      return new Error(result.message);
    }

    this.effectTransaction(transactionAccount, value, type);

    const newTransactionResponse: CreateTransactionResponse = {
      id: result.id,
      value: result.value,
      description: result.description,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return newTransactionResponse;
  }

  async createTransferTransaction({
    receiverAccountId,
    originalAccountId,
    value,
    description,
  }: CreateTransferTransactionRequest): Promise<
    CreateTransactionResponse | Error
  > {
    const originalAccount = await this.accountRepository.findOne({
      where: { id: originalAccountId },
    });

    const receiverAccount = await this.accountRepository.findOne({
      where: { id: receiverAccountId },
    });

    if (!this.validateAccountTransaction(originalAccount, value)) {
      return new Error("Saldo insuficiente para a transferência.");
    }

    const withdrawalTransaction = await this.createTransaction(
      "withdrawal",
      description,
      value,
      originalAccount,
    );
    this.effectTransaction(originalAccount, value, "withdrawal");

    if (withdrawalTransaction instanceof Error) {
      return new Error(withdrawalTransaction.message);
    }

    await this.createTransaction(
      "deposit",
      description,
      value,
      receiverAccount,
    );
    this.effectTransaction(receiverAccount, value, "deposit");

    const withdrawalTransactionResponse: CreateTransactionResponse = {
      id: withdrawalTransaction.id,
      value: withdrawalTransaction.value,
      description: withdrawalTransaction.description,
      createdAt: withdrawalTransaction.createdAt,
      updatedAt: withdrawalTransaction.updatedAt,
    };

    return withdrawalTransactionResponse;
  }

  async listAllAccountTransactions({
    accountId,
    type,
    currentPage,
    itemsPerPage,
  }: listAllAccountTransactionsRequest) {
    const whereCondition: any = { account: { id: accountId } };
    if (type) {
      if (type === "debit") {
        whereCondition.type = "deposit";
      } else {
        whereCondition.type = "withdrawal";
      }
    }

    const [transactions, _] = await this.transactionRepository.findAndCount({
      where: whereCondition,
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
      order: { createdAt: "DESC" },
    });

    return {
      data: transactions,
      pagination: {
        itemsPerPage: transactions.length,
        currentPage,
      },
    };
  }

  async revertTransactions({
    accountId,
    transactionId,
  }: RevertTransactionRequest): Promise<boolean | Error> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ["account"],
    });

    if (transaction.reverted) {
      return new Error("Transação ja foi revertida anteriormente!");
    }

    const accountRepository = AppDataSource.getRepository(Account);
    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    if (
      transaction.type === "deposit" &&
      !this.validateAccountTransaction(account, transaction.value)
    ) {
      return new Error(
        "Transação não pode ser efetuada, por saldo insuficiente!",
      );
    }

    if (transaction.type === "deposit") {
      return await this.effectTransaction(
        account,
        transaction.value,
        "withdrawal",
      );
    } else {
      return await this.effectTransaction(
        account,
        transaction.value,
        "deposit",
      );
    }
  }
}
