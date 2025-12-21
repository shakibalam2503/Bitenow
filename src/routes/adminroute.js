const express = require("express");
const router = express.Router();

const { approveRestaurant, getPendingRestaurants, getAllUsers } =
  require("../controllers/admincontroller");

const { protect } =
  require("../middleware/authmiddleware");

const { authorize } =
  require("../middleware/rolemiddleware");

router.get(
  "/restaurants/pending",
  protect,
  authorize("ADMIN"),
  getPendingRestaurants
);

router.get(
  "/users",
  protect,
  authorize("ADMIN"),
  getAllUsers
);

router.patch(
  "/restaurants/:restaurantId/approve",
  protect,
  authorize("ADMIN"),
  approveRestaurant
);

module.exports = router;
