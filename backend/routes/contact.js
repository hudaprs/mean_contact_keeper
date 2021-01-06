const router = require("express").Router();
const auth = require("../app/middleware/auth");
const contactValidation = require("../app/middleware/validations/ContactValidation");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../app/controllers/ContactController");

router.get("/", auth, getContacts);
router.post("/", [auth, contactValidation], createContact);
router.put("/:id", auth, updateContact);
router.delete("/:id", auth, deleteContact);

module.exports = router;
