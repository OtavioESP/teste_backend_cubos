import { People } from "../../entities/people";
import AppDataSource from "../..";
import { Repository } from "typeorm";
import { checkDocumentValidity } from "../../helpers/validateDocument";

type CreatePersonRequest = {
  name: string;
  document: string;
  password: string;
};

export class PeopleServices {
  private personRepository: Repository<People>;

  constructor() {
    this.personRepository = AppDataSource.getRepository(People);
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

  async createPeople({
    name,
    document,
    password,
  }: CreatePersonRequest): Promise<People | Error> {
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

    // adicionar o tipo cpf ou cnpj pessoa fisica ou juridica
    const newPerson = this.personRepository.create({
      name,
      document: formatedDocument,
      password,
    });

    await this.personRepository.save(newPerson);
    return newPerson;
  }
}
