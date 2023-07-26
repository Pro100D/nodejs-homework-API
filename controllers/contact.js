import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/httpError.js";
import Contact, { addSchema, favoriteSchema } from "../models/contactShema.js";

const getAllContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = false } = req.query;
  const skip = (page - 1) * limit;

  const allContact = favorite
    ? await Contact.find({ favorite, owner }, "-createdAd, -updateAd")
    : await Contact.find({ owner }, "-createdAd, -updateAd", {
        skip,
        limit,
      });

  res.json(allContact);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);

  if (!contactById) {
    throw HttpError(404, "Not Faund");
  }

  res.json(contactById);
};

const addContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { _id: owner } = req.user;

  const contactAdd = await Contact.create({ ...req.body, owner });
  res.status(201).json(contactAdd);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  if (!contactId) {
    throw HttpError(404, "Not Faund");
  }

  await Contact.findOneAndRemove({ _id: contactId });

  res.json("contact deleted");
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const { error } = addSchema.validate(req.body);

  if (error) {
    throw HttpError(400, `missing fields ${error.message}`);
  }
  const contactUpdate = await Contact.findOneAndUpdate(
    { _id: contactId },
    req.body,
    {
      new: true,
    }
  );
  if (!contactUpdate) {
    throw HttpError(404, "Not Faund");
  }
  res.json(contactUpdate);
};

const updateFavoriteOnContact = async (req, res) => {
  const { contactId } = req.params;
  const { error } = favoriteSchema.validate(req.body);

  if (error) {
    throw HttpError(400, `missing fields ${error.message}`);
  }
  const updateStatusContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    req.body,
    {
      new: true,
    }
  );
  if (!updateStatusContact) {
    throw HttpError(404, "Not Faund");
  }
  res.json(updateStatusContact);
};

export default {
  getAllContact: ctrlWrapper(getAllContact),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateFavoriteOnContact: ctrlWrapper(updateFavoriteOnContact),
};
