import express from "express";
import ctrl from "../../controllers/auth.js";
import authenticete from "../../middlevares/authenticete.js";

const router = express.Router();

router.post("/register", ctrl.registerUser);
router.post("/login", ctrl.logInUser);
router.get("/current", authenticete, ctrl.getCurrentUser);
router.post("/logout", authenticete, ctrl.logOutUser);

export default router;
