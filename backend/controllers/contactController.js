const ContactMessage = require("../models/ContactMessage");

const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createContactMessage,
};
