import express from "express";

import authControllers from "../controllers/authControllers.js";

import {
  userRegisterSchema as userRegisterSchema,
  userLoginSchema as userLoginSchema,
} from "../schemas/usersShchemas.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  authControllers.register
);

authRouter.post("/login", validateBody(userLoginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
