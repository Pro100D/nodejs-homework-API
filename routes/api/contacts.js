const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models");
const { HttpError } = require("../../helpers/httpError");
const Joi = require("joi");
const router = express.Router();

const addSchema = Joi.object({
  phone: Joi.number().required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const allContact = await listContacts();
    res.json(allContact);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);

    if (!contactById) {
      throw HttpError(404, "Not Faund");
    }

    res.json(contactById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const contactAdd = await addContact(req.body);
    res.status(201).json(contactAdd);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      throw HttpError(404, "Not Faund");
    }

    await removeContact(contactId);
    res.json("contact deleted");
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = addSchema.validate(req.body);

    if (error) {
      throw HttpError(400, `missing fields ${error.message}`);
    }
    const contactUpdate = await updateContact(contactId, req.body);
    res.json(contactUpdate);
    if (!contactUpdate) {
      throw HttpError(404, "Not Faund");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
