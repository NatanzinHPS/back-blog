import { Router } from "express";
import auth from "../middlewares/auth";
import { body } from "express-validator";
import validate from "../middlewares/validate";
import upload from "../middlewares/upload";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller";

const router = Router();

router.get("/profile", auth, getProfile);

router.put(
  "/profile",
  auth,
  upload.single("image"),
  [
    body("name").optional().isLength({ min: 2 }).withMessage("Nome inválido"),
    body("email").optional().isEmail().withMessage("Email inválido"),
  ],
  validate,
  updateProfile
);

router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Senha atual é obrigatória"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Nova senha deve ter ao menos 6 caracteres"),
  ],
  validate,
  changePassword
);

export default router;
