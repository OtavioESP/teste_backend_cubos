import axios from "axios";
import {
  COMPLIANCE_EMAIL,
  COMPLIANCE_ENDPOINT,
  COMPLIANCE_PASSWORD,
} from "../config/constants";

async function authCode() {
  const res = await axios.post(`${COMPLIANCE_ENDPOINT}/auth/code`, {
    email: COMPLIANCE_EMAIL,
    password: COMPLIANCE_PASSWORD,
  });

  if (res.status === 200) {
    return res.data.data.authCode;
  }
  return new Error(`${res.status}`);
}

async function authToken(code: string) {
  const res = await axios.post(`${COMPLIANCE_ENDPOINT}/auth/token`, {
    authCode: code,
  });

  if (res.status === 200) {
    return res.data.data.accessToken;
  }
  return new Error(`${res.status}`);
}

async function validate(
  type: string,
  document: string,
  token: string,
): Promise<boolean> {
  try {
    const res = await axios.post(
      `${COMPLIANCE_ENDPOINT}/${type}/validate`,
      { document },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 200) {
      //  Por algum motivo a API retornava o tipo 1 e 2 como validos
      return [1, 2].includes(res.data.data.status);
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function checkDocumentValidity(
  documentType: string,
  document: string,
): Promise<boolean> {
  // Acessar isso uma vez para guardar o token na sessao no constructor do service
  // Sei que não é o ideal mas é uma checagem mais bruta do que o ideal
  const code = await authCode();

  const token = await authToken(code);

  return await validate(documentType, document, token);
}
