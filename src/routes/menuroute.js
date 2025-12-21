const express = require("express");
const router = express.Router();

const {
  createMenu,
  getMenusByRestaurant,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu
} = require("../controllers/menucontroller");

const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/rolemiddleware");
const upload = require("../middleware/uploadmiddleware");

// CREATE MENU (with image)
router.post(
  "/",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  createMenu
);

// GET ALL MENUS (public) - Browse all available food
router.get("/all", getAllMenus);

// GET MENUS (public)
router.get("/:restaurantId", getMenusByRestaurant);

// GET SINGLE MENU BY ID (public)
router.get("/item/:menuId", getMenuById);

// UPDATE MENU (with optional image)
router.patch(
  "/:menuId",
  protect,
  authorize("RESTAURANT"),
  upload.single("image"),
  updateMenu
);

// DELETE MENU
router.delete(
  "/:menuId",
  protect,
  authorize("RESTAURANT"),
  deleteMenu
);

module.exports = router;
