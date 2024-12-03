import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const hashString = async (userValue) => { 
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userValue, salt);
  return hash;
};

export const compareString = async (userPassword, password) => {
  const match = await bcrypt.compare(userPassword, password);
  return match;
};

// Create JWT
export const createJWT = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}