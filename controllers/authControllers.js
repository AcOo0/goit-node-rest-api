import fs from "fs/promises";
import path from "path";

import bcrypt from "bcrypt";
import gravatar from "gravatar";

import jwt from "jsonwebtoken";

import Jimp from "jimp";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: "250", d: "retro" });

  const newUser = await authServices.register({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password wrong");
  }

  const { _id: id, subscription } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "20h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token: token,
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const { path: oldPatch, filename } = req.file;
  const { _id } = req.user;

  const image = await Jimp.read(oldPatch);
  await image.cover(250, 250).writeAsync(oldPatch);

  const newFileName = `${_id}_${filename}`;

  const newPath = path.join(avatarPath, newFileName);
  await fs.rename(oldPatch, newPath);

  const avatarURL = path.join("avatars", newFileName);

  await authServices.updateUser({ _id }, { avatarURL });
  res.status(200).json({ avatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
