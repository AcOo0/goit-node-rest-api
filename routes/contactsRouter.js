import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";

import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateStatusContactSchema),
  contactsControllers.updateContact
);

export default contactsRouter;
