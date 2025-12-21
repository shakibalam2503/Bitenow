const express = require("express");
const router = express.Router();

const { registerRestaurant, getAllRestaurants, getMyRestaurant } =
  require("../controllers/restaurantcontroller");

const { protect } =
  require("../middleware/authmiddleware");

const { authorize } =
  require("../middleware/rolemiddleware");

const upload = require("../middleware/uploadmiddleware");

// Restaurant registration (with image upload)
router.post(
  "/register",
  protect,
  authorize("CUSTOMER"),
  upload.single("image"),
  registerRestaurant
);

// Get MY restaurant
router.get(
  "/me",
  protect,
  authorize("RESTAURANT"),
  getMyRestaurant
);

// Get all restaurants
router.get("/", getAllRestaurants);

module.exports = router;
