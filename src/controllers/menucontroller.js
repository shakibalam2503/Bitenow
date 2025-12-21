const Menu = require("../models/menu");
const Restaurant = require("../models/restaurant");

/**
 * CREATE MENU (with image)
 */
exports.createMenu = async (req, res, next) => {
  try {
    const { name, description, price, tags, cuisine } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Parse tags if sent as stringified JSON (common in FormData)
    let parsedTags = [];
    if (tags) {
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                // If not JSON, maybe comma separated or single value? 
                // For now assuming JSON array string or simple array
                parsedTags = [tags]; 
            }
        } else if (Array.isArray(tags)) {
            parsedTags = tags;
        }
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
      price,
      tags: parsedTags,
      cuisine,
      image: req.file ? req.file.path : null
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
 * GET ALL MENUS (PUBLIC) - For browsing all available food items
 */
exports.getAllMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find({ isAvailable: true })
      .populate('restaurant', 'name address')
      .sort({ createdAt: -1 });

    res.status(200).json({ menus });
  } catch (error) {
    next(error);
  }
};

/**
 * GET MENU BY ID
 */
exports.getMenuById = async (req, res, next) => {
  try {
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId).populate('restaurant', 'name address image');
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ menu });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE MENU (with optional image)
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

    // Update fields from req.body
    const { tags, ...otherUpdates } = req.body;
    
    // Handle tags parsing if present
    if (tags) {
        let parsedTags = [];
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = [tags];
            }
        } else if (Array.isArray(tags)) {
            parsedTags = tags;
        }
        menu.tags = parsedTags;
    }

    Object.assign(menu, otherUpdates);
    
    // Update image if new file uploaded
    if (req.file) {
      menu.image = req.file.path;
    }

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
