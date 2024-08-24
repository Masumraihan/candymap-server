import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};
