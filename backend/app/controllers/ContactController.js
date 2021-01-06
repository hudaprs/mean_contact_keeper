const { success, error } = require("../helpers/responseApi");
const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");
const User = require("../models/User");

/**
 * @desc    Get all contacts
 * @method  GET api/contacts
 * @access  Private
 */
exports.getContacts = async (req, res) => {
  try {
    const contact = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });

    // Check existing contacts
    if (contact.length == 0)
      return res
        .status(200)
        .json(
          success(
            `${req.user.name} doesn't have contact yet`,
            contact,
            res.statusCode
          )
        );

    res
      .status(200)
      .json(success(`${req.user.name} Contact list`, contact, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Create a contact
 * @method  POST api/contacts
 * @access  Private
 */
exports.createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { name, email, phone, type } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id,
    });

    const contact = await newContact.save();

    res.status(201).json(success("Contact created", contact, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Update a contact
 * @method  PUT api/contacts/:id
 * @access  Private
 */
exports.updateContact = async (req, res) => {
  const { name, email, phone, type } = req.body;
  const { id } = req.params;
  let contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    // Check if contact is exists
    if (!contact)
      return res.json(404).json(error("Contact not found", res.statusCode));

    // Check for correct user
    if (contact.user.toString() !== req.user.id)
      return res
        .status(401)
        .json(error("You unauthorized to do this action", res.statusCode));

    contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: contactFields,
      },
      {
        new: true,
      }
    );

    res.status(200).json(success("Contact updated", contact, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};

/**
 * @desc    Delete a contact
 * @method  POST api/contacts/:id
 * @access  Private
 */
exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    let contact = await Contact.findById(id);

    // Check if contact exists
    if (!contact)
      return res.status(404).json(error("Contact not found", res.statusCode));

    if (contact.user.toString() !== req.user.id)
      return res
        .status(401)
        .json(error("You unauthorized to do this action", res.statusCode));

    contact = await Contact.findByIdAndRemove(id);

    res.status(200).json(success("Contact removed", contact, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
};
