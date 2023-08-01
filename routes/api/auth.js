import express from "express";
import ctrl from "../../controllers/auth.js";
import authenticete from "../../middlevares/authenticete.js";
import upload from "../../middlevares/upload.js";

const router = express.Router();

router.post("/register", ctrl.registerUser);
router.post("/login", ctrl.logInUser);
router.get("/current", authenticete, ctrl.getCurrentUser);
router.post("/logout", authenticete, ctrl.logOutUser);
router.patch(
  "/avatars",
  authenticete,
  upload.single("avatar"),
  ctrl.updateAvatar
);

export default router;
