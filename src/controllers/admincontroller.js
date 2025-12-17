const Restaurant = require("../models/restaurant");

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

module.exports = {
  approveRestaurant
};
