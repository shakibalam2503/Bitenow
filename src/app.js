const express = require("express");
const cors = require("cors");
const app = express();
const restaurantRoutes = require("./routes/restaurantroute");
const adminRoutes = require("./routes/adminroute");
const menuRoutes = require("./routes/menuroute");
const orderRoutes = require("./routes/orderroute");
const paymentRoutes = require("./routes/paymentroute");
const deliveryRoutes = require("./routes/deliveryroute");
const settlementRoutes = require("./routes/settlementroute");

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authroute");


app.use("/bitenow/auth", authRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

app.use("/bitenow/restaurants", restaurantRoutes);
app.use("/bitenow/admin", adminRoutes);
app.use("/bitenow/menus", menuRoutes);
app.use("/bitenow/orders", orderRoutes);
app.use("/bitenow/payments", paymentRoutes);
app.use("/bitenow/delivery", deliveryRoutes);
app.use("/bitenow/settlements", settlementRoutes);


module.exports = app;
