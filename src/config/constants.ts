import "dotenv/config";

export const JWT_SECRET = process.env.SECRET_KEY || "";
export const COMPLIANCE_ENDPOINT =
  process.env.BASE_URL || "https://compliance-api.cubos.io";

export const COMPLIANCE_EMAIL = process.env.COMPLIANCE_EMAIL || "";
export const COMPLIANCE_PASSWORD = process.env.COMPLIANCE_PASSWORD || "";
