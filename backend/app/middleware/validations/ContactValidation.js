const { check } = require("express-validator");

module.exports = [check("name", "Name is required").not().isEmpty()];
