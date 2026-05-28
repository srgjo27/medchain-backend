import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  // Convert payload interface to a plain object for compatibility with sign method signature
  const signPayload = {
    userId: payload.userId,
    email: payload.email,
  };
  return jwt.sign(signPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as any;
};
