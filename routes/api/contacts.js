import contactsMethod from "../../controllers/controllers.js";
import isValidId from "../../middlevares/isValidObjectId.js";

import express from "express";

const router = express.Router();

router.get("/", contactsMethod.getAllContact);

router.get("/:contactId", isValidId, contactsMethod.getContactById);

router.post("/", contactsMethod.addContact);

router.delete("/:contactId", isValidId, contactsMethod.deleteContact);

router.put("/:contactId", isValidId, contactsMethod.updateContactById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  contactsMethod.updateFavoriteOnContact
);
export default router;
