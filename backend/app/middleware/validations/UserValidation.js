const { check } = require("express-validator");

module.exports = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password minimal length is 6").isLength({
    min: 6,
  }),
];
