const express = require("express");
const router = express.Router();

const { registerRestaurant } =
  require("../controllers/restaurantcontroller");

const { protect } =
  require("../middleware/authmiddleware");

const { authorize } =
  require("../middleware/rolemiddleware");

// Restaurant registration
router.post(
  "/register",
  protect,
  authorize("CUSTOMER"),
  registerRestaurant
);

module.exports = router;
