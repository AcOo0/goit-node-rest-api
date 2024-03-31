import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, setting = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", setting).populate(
    "owner",
    "username email"
  );

export const countContacts = (filter) => Contact.countDocuments(filter);

export const addContact = (data) => Contact.create(data);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const updateContactByFilter = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);
