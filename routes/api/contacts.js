import HttpError from "../../helpers/httpError.js";
import isValidId from "../../middlevares/isValidObjectId.js";
import Contact, {
  addSchema,
  favoriteSchema,
} from "../../models/contactShema.js";

import express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allContact = await Contact.find();
    res.json(allContact);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findById(contactId);

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

    const contactAdd = await Contact.create(req.body);
    res.status(201).json(contactAdd);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!contactId) {
      throw HttpError(404, "Not Faund");
    }
    console.log(contactId);

    await Contact.findOneAndRemove({ _id: contactId });

    res.json("contact deleted");
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", isValidId, async (req, res, next) => {
  try {
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

    res.json(contactUpdate);
    if (!contactUpdate) {
      throw HttpError(404, "Not Faund");
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", isValidId, async (req, res, next) => {
  try {
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

    res.json(updateStatusContact);
    if (!updateStatusContact) {
      throw HttpError(404, "Not Faund");
    }
  } catch (error) {
    next(error);
  }
});
export default router;
