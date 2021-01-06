const { check } = require("express-validator");

module.exports = [
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").exists(),
];
