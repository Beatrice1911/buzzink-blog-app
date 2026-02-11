const Subscriber = require("../models/Subscriber");
const contactsApi = require("../config/brevo");

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
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Subscriber.create({ email });

    await contactsApi.createContact({
      email,
      updateEnabled: false,
      listIds: [2],
    });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    if (error?.response?.body?.code === "duplicate_parameter") {
      return res.status(409).json({
        message: "You are already subscribed",
      });
    }
    console.error("Brevo error:", error);
    return res.status(500).json({
      message: "Subscription failed",
    });
  }
});
