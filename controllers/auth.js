import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import jimp from "jimp";

import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import User, { registerSchema, loginSchema } from "../models/userShema.js";
import HttpError from "../helpers/httpError.js";

dotenv.config();

const { SECRET_KEY } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const registerUser = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const logInUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { password, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email, subscription: user.subscription } });
};

const getCurrentUser = async (req, res) => {
  const { email } = req.user;

  res.json({
    email,
  });
};

const logOutUser = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ massage: "logout success" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarsDir, fileName);

  const image = await jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL: avatarURL,
  });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  logInUser: ctrlWrapper(logInUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logOutUser: ctrlWrapper(logOutUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
