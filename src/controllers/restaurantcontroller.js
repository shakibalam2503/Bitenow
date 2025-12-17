const Restaurant = require("../models/restaurant");
const User = require("../models/user");

const registerRestaurant = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

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

module.exports = {
  registerRestaurant
};
