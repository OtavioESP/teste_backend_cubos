import { In, Repository } from "typeorm";
import AppDataSource from "../..";
import { Card } from "../../entities/card";
import {
  CreateCardRequest,
  CreateCardResponse,
  ListAccountCardRequest,
} from "./types";
import { Account } from "../../entities/account";

export class CardService {
  private cardRepository = AppDataSource.getRepository(Card);

  private validateCardNumberFormat(cardNumber: string): boolean {
    const regex = /^\d{4} \d{4} \d{4} \d{4}$/;
    return regex.test(cardNumber);
  }

  async createCard({
    accountId,
    type,
    number,
    cvv,
  }: CreateCardRequest): Promise<CreateCardResponse | Error> {
    const cards = await this.cardRepository.findOne({
      where: { account: { id: accountId }, type: "physical" },
    });

    if (!["physical", "virtual"].includes(type)) {
      return new Error("O tipo do cartão deve ser physical ou virtual!");
    }

    if (cards && type === "physical") {
      return new Error("A conta em questão ja possúi um cartão físico!");
    }

    if (!this.validateCardNumberFormat(number)) {
      return new Error(
        "Numero do cartão fora de padrão, tente XXXX XXXX XXXX XXXX.",
      );
    }

    if (cvv.length != 3) {
      return new Error("CVV deve conter apenas 3 digitos!");
    }

    const accountRepository = AppDataSource.getRepository(Account);
    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      return new Error("A conta não está presente no sistema!");
    }

    const newCard = this.cardRepository.create({
      type,
      number,
      cvv,
      account,
    });
    await this.cardRepository.save(newCard);

    const response: CreateCardResponse = {
      id: newCard.id,
      type: newCard.type,
      number: newCard.number.replace(/ /g, "").slice(-4),
      cvv: newCard.cvv,
      createdAt: newCard.createdAt,
      updatedAt: newCard.updatedAt,
    };

    return response;
  }

  async listAllCardsByAccount({
    accountId,
  }: ListAccountCardRequest): Promise<Card[] | Error> {
    const cards = this.cardRepository.find({
      where: { account: { id: accountId } },
    });

    return cards;
  }

  async listAllCardsByUser(
    ownerId: string,
    currentPage: number,
    itemsPerPage: number,
  ) {
    const accountRepository = AppDataSource.getRepository(Account);
    const accounts = await accountRepository.find({
      where: { owner: { id: ownerId } },
      select: ["id"],
    });
    const accountIds = accounts.map((account) => account.id);

    const [cards, _] = await this.cardRepository.findAndCount({
      where: { account: { id: In(accountIds) } },
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
    });

    return {
      data: cards,
      pagination: {
        itemsPerPage: cards.length,
        currentPage,
      },
    };
  }
}
