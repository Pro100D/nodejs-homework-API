import ctrl from "../../controllers/contact.js";
import authenticete from "../../middlevares/authenticete.js";
import isValidId from "../../middlevares/isValidObjectId.js";

import express from "express";

const router = express.Router();

router.get("/", authenticete, ctrl.getAllContact);

router.get("/:contactId", authenticete, isValidId, ctrl.getContactById);

router.post("/", authenticete, ctrl.addContact);

router.delete("/:contactId", authenticete, isValidId, ctrl.deleteContact);

router.put("/:contactId", authenticete, isValidId, ctrl.updateContactById);

router.patch(
  "/:contactId/favorite",
  authenticete,
  isValidId,
  ctrl.updateFavoriteOnContact
);
export default router;
