import { TransactionServices } from "../src/services/transaction/TransactionService";
import { Account } from "../src/entities/account";
import { Transaction } from "../src/entities/transaction";
import { Repository } from "typeorm";

const mockTransactionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
} as unknown as Repository<Transaction>;

const mockAccountRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
} as unknown as Repository<Account>;

jest.mock("../src/index.ts", () => ({
  getRepository: jest.fn().mockImplementation((entity) => {
    if (entity === Transaction) return mockTransactionRepository;
    if (entity === Account) return mockAccountRepository;
  }),
}));

describe("TransactionServices", () => {
  let transactionService: TransactionServices;

  beforeEach(() => {
    jest.clearAllMocks();
    transactionService = new TransactionServices();
  });

  describe("createRawTransaction", () => {
    it("should create a deposit transaction if value is positive", async () => {
      const newTransactionData = {
        value: 100,
        description: "Deposit",
        accountId: "account-id-123",
      };

      const mockAccount = { id: "account-id-123", amount: 500 };
      mockAccountRepository.findOne.mockResolvedValue(mockAccount);
      mockTransactionRepository.create.mockReturnValue(newTransactionData);
      mockTransactionRepository.save.mockResolvedValue(newTransactionData);

      const response = await transactionService.createRawTransaction(
        newTransactionData
      );

      expect(mockTransactionRepository.create).toHaveBeenCalledWith({
        type: "deposit",
        description: "Deposit",
        value: 100,
        account: mockAccount,
      });
      expect(mockAccountRepository.save).toHaveBeenCalledWith({
        ...mockAccount,
        amount: 600,
      });
      expect(response).toEqual({
        id: expect.any(String),
        value: 100,
        description: "Deposit",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return an error if transaction amount is zero", async () => {
      const response = await transactionService.createRawTransaction({
        value: 0,
        description: "Invalid Transaction",
        accountId: "account-id-123",
      });

      expect(response).toEqual(new Error("A transação não pode ter valor 0!"));
    });
  });

  describe("createTransferTransaction", () => {
    it("should create a withdrawal and deposit transaction for transfer", async () => {
      const transferData = {
        value: 100,
        description: "Transfer",
        receiverAccountId: "receiver-id-456",
        originalAccountId: "account-id-123",
      };

      const originalAccount = { id: "account-id-123", amount: 500 };
      const receiverAccount = { id: "receiver-id-456", amount: 300 };

      mockAccountRepository.findOne
        .mockResolvedValueOnce(originalAccount)
        .mockResolvedValueOnce(receiverAccount);

      mockTransactionRepository.create.mockReturnValue(transferData);
      mockTransactionRepository.save.mockResolvedValue(transferData);

      const response = await transactionService.createTransferTransaction(
        transferData
      );

      expect(mockTransactionRepository.create).toHaveBeenCalledTimes(2);
      expect(mockAccountRepository.save).toHaveBeenCalledWith({
        ...originalAccount,
        amount: 400,
      });
      expect(mockAccountRepository.save).toHaveBeenCalledWith({
        ...receiverAccount,
        amount: 400,
      });
      expect(response).toEqual({
        id: expect.any(String),
        value: 100,
        description: "Transfer",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("listAllAccountTransactions", () => {
    it("should return paginated list of account transactions", async () => {
      const accountId = "account-id-123";
      const type = "debit";
      const currentPage = 1;
      const itemsPerPage = 10;

      const mockTransactions = [
        { id: "transaction-id-1", type: "deposit", value: 100 },
      ];
      mockTransactionRepository.findAndCount.mockResolvedValueOnce([
        mockTransactions,
        1,
      ]);

      const response = await transactionService.listAllAccountTransactions({
        accountId,
        type,
        currentPage,
        itemsPerPage,
      });

      expect(mockTransactionRepository.findAndCount).toHaveBeenCalledWith({
        where: { account: { id: accountId }, type: "deposit" },
        take: itemsPerPage,
        skip: 0,
        order: { createdAt: "DESC" },
      });
      expect(response).toEqual({
        data: mockTransactions,
        pagination: {
          itemsPerPage: 1,
          currentPage,
        },
      });
    });
  });

  describe("revertTransactions", () => {
    it("should revert a deposit transaction", async () => {
      const transactionId = "transaction-id-1";
      const accountId = "account-id-123";
      const mockTransaction = {
        id: transactionId,
        type: "deposit",
        value: 100,
        account: { id: accountId, amount: 200 },
        reverted: false,
      };

      mockTransactionRepository.findOne.mockResolvedValueOnce(mockTransaction);
      mockAccountRepository.save.mockResolvedValueOnce({
        ...mockTransaction.account,
        amount: 100,
      });

      const response = await transactionService.revertTransactions({
        accountId,
        transactionId,
      });

      expect(mockAccountRepository.save).toHaveBeenCalledWith({
        ...mockTransaction.account,
        amount: 100,
      });
      expect(response).toBe(true);
    });
  });
});
