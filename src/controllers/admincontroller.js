const Restaurant = require("../models/restaurant");
const User = require("../models/user");

const approveRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    restaurant.status = status;
    restaurant.isActive = status === "APPROVED";
    await restaurant.save();

    res.status(200).json({
      message: `Restaurant ${status.toLowerCase()} successfully`,
      restaurant
    });

  } catch (error) {
    next(error);
  }
};

const getPendingRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ status: "PENDING" }).populate("owner", "firstName lastName email");
    res.status(200).json({
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  approveRestaurant,
  getPendingRestaurants,
  getAllUsers
};
