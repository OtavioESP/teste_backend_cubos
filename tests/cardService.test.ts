import { CardService } from "../src/services/card/CardService";
import AppDataSource from "../src";
import { Card } from "../src/entities/card";
import { Account } from "../src/entities/account";

jest.mock('../src/index.ts', () => ({
  getRepository: jest.fn(),
}));

const mockCardRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
};

const mockAccountRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
  if (entity === Card) return mockCardRepository;
  if (entity === Account) return mockAccountRepository;
});

describe("CardService", () => {
  let service: CardService;

  beforeEach(() => {
    service = new CardService();
    jest.clearAllMocks();
  });

  describe("createCard", () => {
    it("should return an error if card type is invalid", async () => {
      const response = await service.createCard({
        accountId: "1",
        type: "invalid" as any,
        number: "1234 5678 9999 5678",
        cvv: "123",
      });

      expect(response).toEqual(new Error("O tipo do cartão deve ser physical ou virtual!"));
    });

    it("should return an error if a physical card already exists", async () => {
      mockCardRepository.findOne.mockResolvedValue({ id: "1", type: "physical" });

      const response = await service.createCard({
        accountId: "1",
        type: "physical",
        number: "1234 5678 1234 5678",
        cvv: "123",
      });

      expect(response).toEqual(new Error("A conta em questão ja possúi um cartão físico!"));
    });

    it("should return an error if card number format is invalid", async () => {
      const response = await service.createCard({
        accountId: "1",
        type: "virtual",
        number: "1234567812345678",
        cvv: "123",
      });

      expect(response).toEqual(new Error("Numero do cartão fora de padrão, tente XXXX XXXX XXXX XXXX."));
    });

    it("should return an error if a card with the same number exists", async () => {
      mockCardRepository.find.mockResolvedValue([{ id: "1", number: "1234 5678 1234 5678" }]);

      const response = await service.createCard({
        accountId: "1",
        type: "virtual",
        number: "1234 5678 1234 5999",
        cvv: "123",
      });

      expect(response).toEqual(new Error("Não devem existir cartões com mesmo número!"));
    });

    it("should return an error if CVV is not 3 digits", async () => {
      const response = await service.createCard({
        accountId: "1",
        type: "virtual",
        number: "1224 9999 1904 5000",
        cvv: "12",
      });

      expect(response).toEqual(new Error("CVV deve conter apenas 3 digitos!"));
    });

    it("should return an error if account does not exist", async () => {
      mockAccountRepository.findOne.mockResolvedValue(null);

      const response = await service.createCard({
        accountId: "1219",
        type: "virtual",
        number: "1034 1008 9994 9999",
        cvv: "123",
      });

      expect(response).toEqual(new Error("A conta não está presente no sistema!"));
    });

    it("should create and return a new card response on valid data", async () => {
      mockAccountRepository.findOne.mockResolvedValue({ id: "1" });
      mockCardRepository.findOne.mockResolvedValue(null);
      mockCardRepository.find.mockResolvedValue([]);
      mockCardRepository.create.mockReturnValue({
        id: "1",
        type: "virtual",
        number: "1234 5678 1234 5678",
        cvv: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockCardRepository.save.mockResolvedValue({
        id: "1",
        type: "virtual",
        number: "1234 5678 1234 5678",
        cvv: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await service.createCard({
        accountId: "1",
        type: "virtual",
        number: "1234 5678 1234 5678",
        cvv: "123",
      });

      expect(response).toMatchObject({
        id: "1",
        type: "virtual",
        number: "5678",
      });
    });
  });

  describe("listAllCardsByAccount", () => {
    it("should list all cards by account", async () => {
      const mockCards = [{ id: "1" }, { id: "2" }];
      mockCardRepository.find.mockResolvedValue(mockCards);

      const response = await service.listAllCardsByAccount({ accountId: "1" });

      expect(response).toEqual(mockCards);
    });
  });

  describe("listAllCardsByUser", () => {
    it("should list all cards by user with pagination", async () => {
      mockAccountRepository.find.mockResolvedValue([{ id: "1" }, { id: "2" }]);
      mockCardRepository.findAndCount.mockResolvedValue([
        [
          { id: "1", number: "1234 5678 1234 5678" },
          { id: "2", number: "8765 4321 8765 4321" },
        ],
        2,
      ]);

      const response = await service.listAllCardsByUser({
        ownerId: "user1",
        currentPage: 1,
        itemsPerPage: 10,
      });

      expect(response).toEqual({
        data: [
          { id: "1", number: "5678" },
          { id: "2", number: "4321" },
        ],
        pagination: {
          itemsPerPage: 2,
          currentPage: 1,
        },
      });
    });
  });
});
