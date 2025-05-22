import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter no mínimo 6 caracteres"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha obrigatória"),
  ],
  validate,
  login
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Email inválido")],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token obrigatório"),
    body("newPassword").isLength({ min: 6 }).withMessage("Nova senha fraca"),
  ],
  validate,
  resetPassword
);
export default router;
