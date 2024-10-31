import "dotenv/config";

export const JWT_SECRET = process.env.SECRET_KEY || "teste_backend_cubos";
export const COMPLIANCE_ENDPOINT =
  process.env.BASE_URL || "https://compliance-api.cubos.io";
export const COMPLIANCE_EMAIL = process.env.COMPLIANCE_EMAIL || "";
export const COMPLIANCE_PASSWORD = process.env.COMPLIANCE_PASSWORD || "";

export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

export const TYPEORM_MIGRATIONS = process.env.TYPEORM_MIGRATIONS;
export const TYPEORM_MIGRATIONS_DIR = process.env.TYPEORM_MIGRATIONS_DIR;
