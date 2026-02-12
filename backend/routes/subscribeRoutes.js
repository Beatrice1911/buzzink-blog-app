const express = require("express");
const Subscriber = require("../models/Subscriber");
const contactsApi = require("../config/brevo");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    await contactsApi.createContact({
      email,
      updateEnabled: true,
      listIds: [2],
    });

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Brevo error:", error);
    if (error.response?.body?.code === "duplicate_parameter") {
      return res.status(409).json({ message: "Already subscribed" });
    }
    res.status(500).json({
      message: "Subscription failed",
    });
  }
});

module.exports = router;
