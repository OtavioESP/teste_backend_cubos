export type CreateTransactionResponse = {
  id: string;
  value: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransactionRequest = {
  accountId: string;
  value: number;
  description: string;
};

export type CreateTransferTransactionRequest = {
  receiverAccountId: string;
  originalAccountId: string;
  value: number;
  description: string;
};

export type listAllAccountTransactionsRequest = {
  accountId: string;
  type: any;
  currentPage: number;
  itemsPerPage: number;
};

export type RevertTransactionRequest = {
  accountId: string;
  transactionId: string;
};
