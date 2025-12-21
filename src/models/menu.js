const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    image: {
      type: String, // 👈 Cloudinary image URL
      default: null
    },

    tags: {
      type: [String],
      enum: [
        "VEGAN",
        "VEGETARIAN",
        "EGG",
        "HALAL",
        "DAIRY",
        "NUTS",
        "PEANUTS",
        "PORK",
        "GLUTEN_FREE"
      ],
      default: []
    },

    cuisine: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Menu", menuSchema);
