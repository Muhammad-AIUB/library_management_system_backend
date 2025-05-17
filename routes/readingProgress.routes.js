const express = require("express");
const router = express.Router();

// Reading Progress Routes
router.get("/", (req, res) => {
  res.json({ message: "Reading Progress route is working!" });
});

module.exports = router;
