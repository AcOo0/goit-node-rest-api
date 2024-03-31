import * as contactsServices from "../services/contactsServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsServices.listContacts(
    { owner },
    { skip, limit }
  );
  const total = await contactsServices.countContacts({ owner });

  res.json({
    result,
    total,
  });
};

const getOneContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await contactsServices.getContactByFilter({ owner, _id: id });
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const deleteContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await contactsServices.removeContact({ owner, _id: id });
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await contactsServices.addContact({ ...req.body, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const result = await contactsServices.updateContactByFilter(
    { owner, _id: id },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
