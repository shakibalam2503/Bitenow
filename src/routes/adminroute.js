const express = require("express");
const router = express.Router();

const { approveRestaurant } =
  require("../controllers/admincontroller");

const { protect } =
  require("../middleware/authmiddleware");

const { authorize } =
  require("../middleware/rolemiddleware");

router.patch(
  "/restaurants/:restaurantId/approve",
 // protect,
 // authorize("ADMIN"),
  approveRestaurant
);

module.exports = router;
