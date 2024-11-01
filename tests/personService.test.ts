import jwt from "jsonwebtoken";
import { PeopleServices } from "../src/services/people/PeopleService";
import { People } from "../src/entities/people";
import AppDataSource from "../src";
import { checkDocumentValidity } from "../src/helpers/validateDocument";
import { JWT_SECRET } from "../src/config/constants";

jest.mock("../src/index.ts", () => ({
  getRepository: jest.fn(),
}));

jest.mock("jsonwebtoken");
jest.mock("../src/helpers/validateDocument");

describe("PeopleServices", () => {
  let peopleService: PeopleServices;
  const mockPersonRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

beforeAll(() => {
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockPersonRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return a token if document and password are valid", async () => {
      const mockPerson = { id: "1", document: "12345678901", password: "password123" };
      mockPersonRepository.findOne.mockResolvedValue(mockPerson);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");


      const response = await peopleService.login({
        document: "12345678901",
        password: "password123",
      });

      expect(response).toBe("mockToken");
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockPerson.id }, JWT_SECRET, { expiresIn: "5h" });
    });

    it("should return an error if person does not exist", async () => {
      mockPersonRepository.findOne.mockResolvedValue(null);

      const response = await peopleService.login({
        document: "12345678901",
        password: "password123",
      });

      expect(response).toEqual(new Error("Usuário inválido!"));
    });

    it("should return an error if password is incorrect", async () => {
      const mockPerson = { id: "1", document: "12345678901", password: "password123" };
      mockPersonRepository.findOne.mockResolvedValue(mockPerson);

      const response = await peopleService.login({
        document: "12345678901",
        password: "wrongpassword",
      });

      expect(response).toEqual(new Error("Usuário inválido!"));
    });
  });

  describe("createPeople", () => {
    it("should create and return a new person if data is valid", async () => {
      const newPersonData = {
        name: "John Doe",
        document: "123.456.789-01",
        password: "password123",
      };

      mockPersonRepository.findOne.mockResolvedValue(null); 
      checkDocumentValidity.mockResolvedValue(true); 
      const mockSavedPerson = {
        id: "1",
        ...newPersonData,
        document: "12345678901",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPersonRepository.create.mockReturnValue(mockSavedPerson);
      mockPersonRepository.save.mockResolvedValue(mockSavedPerson);

      const response = await peopleService.createPeople(newPersonData);

      expect(response).toEqual({
        id: mockSavedPerson.id,
        name: mockSavedPerson.name,
        document: mockSavedPerson.document,
        createdAt: mockSavedPerson.createdAt,
        updatedAt: mockSavedPerson.updatedAt,
      });
    });

    it("should return an error if document is incomplete", async () => {
      const response = await peopleService.createPeople({
        name: "John Doe",
        document: "12345",
        password: "password123",
      });

      expect(response).toEqual(new Error("Documento incompleto!"));
    });

    it("should return an error if document is invalid", async () => {
      const newPersonData = {
        name: "John Doe",
        document: "123.456.789-01",
        password: "password123",
      };
      checkDocumentValidity.mockResolvedValue(false); 

      const response = await peopleService.createPeople(newPersonData);

      expect(response).toEqual(new Error("O CPF ou CNPJ não é válido!"));
    });

    it("should return an error if person already exists with document", async () => {
      const newPersonData = {
        name: "John Doe",
        document: "123.456.789-01",
        password: "password123",
      };
      const existingPerson = { id: "1", document: "12345678901" };
      mockPersonRepository.findOne.mockResolvedValue(existingPerson); 

      const response = await peopleService.createPeople(newPersonData);

      expect(response).toEqual(new Error("Uma pessoa já existe com esse documento!"));
    });
  });
});
