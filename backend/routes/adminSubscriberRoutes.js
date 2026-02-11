const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { requireAuth, isAdmin } = require("../middleware/auth");

router.get("/", requireAuth, isAdmin, async (req, res) => {
  try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 8, 1);
      const skip = (page - 1) * limit;
  
      const [subscribers, total] = await Promise.all([
        Subscriber.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Subscriber.countDocuments(),
      ]);
  
      res.json({
        data: subscribers,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    } catch (err) {
      next(err);
    }
});

router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  res.json({ message: "Subscriber removed" });
});

module.exports = router;