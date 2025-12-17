const Menu = require("../models/Menu");
const Restaurant = require("../models/restaurant");

/**
 * CREATE MENU
 * Only APPROVED restaurant owner
 */
exports.createMenu = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const restaurant = await Restaurant.findOne({
      owner: req.user._id,
      status: "APPROVED",
      isActive: true
    });

    if (!restaurant) {
      return res.status(403).json({
        message: "Restaurant not approved or not found"
      });
    }

    const menu = await Menu.create({
      restaurant: restaurant._id,
      name,
      description,
      price
    });

    res.status(201).json({
      message: "Menu created successfully",
      menu
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET MENUS (PUBLIC)
 */
exports.getMenusByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const menus = await Menu.find({ restaurant: restaurantId });

    res.status(200).json({ menus });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE MENU
 * Only restaurant owner
 */
exports.updateMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const restaurant = await Restaurant.findOne({
      _id: menu.restaurant,
      owner: req.user._id
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(menu, req.body);
    await menu.save();

    res.status(200).json({
      message: "Menu updated successfully",
      menu
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE MENU
 * Only restaurant owner
 */
exports.deleteMenu = async (req, res, next) => {
  try {
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const restaurant = await Restaurant.findOne({
      _id: menu.restaurant,
      owner: req.user._id
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Access denied" });
    }

    await menu.deleteOne();

    res.status(200).json({
      message: "Menu deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
