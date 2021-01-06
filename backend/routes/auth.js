const router = require("express").Router();
const { getLoggedUser, login } = require("../app/controllers/AuthController");
const auth = require("../app/middleware/auth");
const loginValidation = require("../app/middleware/validations/LoginValidation");

router.get("/", auth, getLoggedUser);
router.post("/", loginValidation, login);

module.exports = router;
