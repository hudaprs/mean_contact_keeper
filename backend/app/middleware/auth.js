const { error } = require("../helpers/responseApi");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json(error("Token not found", res.statusCode));

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    if (!decoded)
      return res.status(400).json(error("Token invalid", res.statusCode));

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json(error("Unauthorized", res.statusCode));
  }
};
