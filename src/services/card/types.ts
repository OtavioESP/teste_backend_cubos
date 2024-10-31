export type CreateCardRequest = {
  type: "physical" | "virtual" | null;
  accountId: string;
  number: string;
  cvv: string;
};

export type CreateCardResponse = {
  id: string;
  type: string;
  number: string;
  cvv: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListAccountCardRequest = {
  accountId: string;
};

export type listAllCardsByUserRequest = {
  ownerId: string;
  currentPage: number;
  itemsPerPage: number;
};
