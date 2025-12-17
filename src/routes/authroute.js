const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authcontroller");
const { protect } = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role
  });
});

module.exports = router;
