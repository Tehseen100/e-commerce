import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/user.validator.js";

const router = Router();

router.get("/register", validateBody(registerSchema), registerUser);

export default router;