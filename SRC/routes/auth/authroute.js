import express from "express";
import { signUp, verifyOtp, logIn } from "../../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/verifyOtp", verifyOtp);
router.post("/login", logIn);

export default router;
