import { People } from "../../entities/people";

export type CreateAccountRequest = {
  branch: string;
  account: string;
  ownerId: string;
};

export type CreateAccountResponse = {
  id: string;
  branch: string;
  account: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListAccountRequest = {
  ownerId: string;
};

export type ListAccountResponse = {
  id: string;
  branch: string;
  account: string;
  owner: People;
  createdAt: Date;
  updatedAt: Date;
};
