export type CreatePersonRequest = {
  name: string;
  document: string;
  password: string;
};

export type CreatePeopleResponse = {
  id: string;
  name: string;
  document: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginRequest = {
  document: string;
  password: string;
};
