const Restaurant = require("../models/restaurant");
const User = require("../models/user");

const registerRestaurant = async (req, res, next) => {
  try {
    const { name, email, phone, address, latitude, longitude } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if user already owns a restaurant
    const existingRestaurant = await Restaurant.findOne({
      owner: req.user._id
    });

    if (existingRestaurant) {
      return res.status(409).json({
        message: "Restaurant already registered"
      });
    }

    const restaurant = await Restaurant.create({
      name,
      email,
      phone,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      image: req.file ? req.file.path : null,
      owner: req.user._id
    });

    // Update user role to RESTAURANT
    req.user.role = "RESTAURANT";
    await req.user.save();

    res.status(201).json({
      message: "Restaurant registered successfully. Awaiting admin approval.",
      restaurant
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL RESTAURANTS (Public)
 */
const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.status(200).json({
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET MY RESTAURANT (Protected)
 */
const getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found for this user" });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerRestaurant,
  getAllRestaurants,
  getMyRestaurant
};
