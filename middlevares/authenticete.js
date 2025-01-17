import HttpError from "../helpers/httpError.js";
import User from "../models/userShema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { SECRET_KEY } = process.env;

const authenticete = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" && !token) {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
export default authenticete;
