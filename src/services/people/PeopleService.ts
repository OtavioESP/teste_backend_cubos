import jwt from "jsonwebtoken";
import { People } from "../../entities/people";
import AppDataSource from "../..";
import { checkDocumentValidity } from "../../helpers/validateDocument";
import { JWT_SECRET } from "../../config/constants";
import {
  CreatePeopleResponse,
  CreatePersonRequest,
  LoginRequest,
} from "./types";

export class PeopleServices {
  private personRepository = AppDataSource.getRepository(People);

  private generateToken(person: People): string {
    return jwt.sign({ id: person.id }, JWT_SECRET, { expiresIn: "5h" });
  }

  async login({ document, password }: LoginRequest): Promise<string | Error> {
    const person = await this.personRepository.findOne({
      where: { document: document },
    });

    if (!person || person.password !== password) {
      return new Error("Usuário inválido!");
    }

    return this.generateToken(person);
  }

  async createPeople({
    name,
    document,
    password,
  }: CreatePersonRequest): Promise<CreatePeopleResponse | Error> {
    const documentType = this.checkDocumentType(document);
    if (!documentType) {
      return new Error("Documento incompleto!");
    }

    const formatedDocument = this.cleanDocument(document);

    const documentIsValid = await checkDocumentValidity(
      documentType,
      formatedDocument,
    );

    if (!documentIsValid) {
      return new Error("O CPF ou CNPJ não é válido!");
    }

    if (
      await this.personRepository.findOne({
        where: { document: formatedDocument },
      })
    ) {
      return new Error("Uma pessoa já existe com esse documento!");
    }

    const newPerson = this.personRepository.create({
      name,
      document: formatedDocument,
      password,
    });

    await this.personRepository.save(newPerson);

    const newPersonResponse: CreatePeopleResponse = {
      id: newPerson.id,
      name: newPerson.name,
      document: newPerson.document,
      createdAt: newPerson.createdAt,
      updatedAt: newPerson.updatedAt,
    };

    return newPersonResponse;
  }

  private checkDocumentType(document: string): string | null {
    if (document.length === 14) {
      return "cpf";
    } else if (document.length === 18) {
      return "cnpj";
    } else {
      return null;
    }
  }

  private cleanDocument(document: string): string {
    return document.replace(/\D/g, "");
  }
}
