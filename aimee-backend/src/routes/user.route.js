const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const {
  createSchema,
  updateSchema,
  authenticateSchema,
} = require("../schemas/userSchema");
const auth = require("../middlewares/auth");

const router = express.Router();
router.post("/signup", userController.signup);
router.post("/signin", authenticateSchema, userController.signin);
router.get("/", userController.getAll);
router.get("/:id", userController.getById);

module.exports = router;