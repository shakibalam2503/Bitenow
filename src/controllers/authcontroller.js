const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { redisClient } = require("../config/redis");

/**
 * =========================
 * REGISTER
 * =========================
 * Public route
 */
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user (role defaults to CUSTOMER)
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 * Public route
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // 5. If user is RESTAURANT, fetch restaurant details
    let restaurant = null;
    if (user.role === 'RESTAURANT') {
      const Restaurant = require("../models/restaurant");
      restaurant = await Restaurant.findOne({ owner: user._id });
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        restaurant: restaurant
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================
 * LOGOUT (Redis blacklist)
 * =========================
 * Protected route
 */
const logout = async (req, res) => {
  try {
    const token = req.token;

    // Decode token to get expiry time
    const decoded = jwt.decode(token);

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    // Store token in Redis blacklist
    await redisClient.setEx(
      `bl_${token}`,
      expiresIn,
      "true"
    );

    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed"
    });
  }
};

module.exports = {
  register,
  login,
  logout
};
