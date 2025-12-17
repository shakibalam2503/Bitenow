const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
      // hashed password → do NOT limit length
    },

    role: {
      type: String,
      enum: ["ADMIN", "RESTAURANT", "CUSTOMER", "DELIVERY"],
      default: "CUSTOMER"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
