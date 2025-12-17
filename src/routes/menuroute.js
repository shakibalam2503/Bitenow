const express = require("express");
const router = express.Router();

const {
  createMenu,
  getMenusByRestaurant,
  updateMenu,
  deleteMenu
} = require("../controllers/menucontroller");

const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/rolemiddleware");

// Create menu (Restaurant only)
router.post(
  "/",
  protect,
  authorize("RESTAURANT"),
  createMenu
);

// Get menus (Public)
router.get("/:restaurantId", getMenusByRestaurant);

// Update menu
router.patch(
  "/:menuId",
  protect,
  authorize("RESTAURANT"),
  updateMenu
);

// Delete menu
router.delete(
  "/:menuId",
  protect,
  authorize("RESTAURANT"),
  deleteMenu
);

module.exports = router;
