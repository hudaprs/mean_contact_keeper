const router = require("express").Router();
const { register } = require("../app/controllers/UserController");
const userValidation = require("../app/middleware/validations/UserValidation");

router.post("/", userValidation, register);

module.exports = router;
