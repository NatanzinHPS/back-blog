import { Router } from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller";
import validate from "../middlewares/validate";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres"),
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

export default router;
