require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Testing Cloudinary Connection...");
console.log(`Cloud Name: '${process.env.CLOUDINARY_CLOUD_NAME}' (Length: ${process.env.CLOUDINARY_CLOUD_NAME.length})`);
console.log(`API Key: '${process.env.CLOUDINARY_API_KEY}' (Length: ${process.env.CLOUDINARY_API_KEY.length})`);
console.log(`API Secret: '${process.env.CLOUDINARY_API_SECRET}' (Length: ${process.env.CLOUDINARY_API_SECRET.length})`);
console.log(`CLOUDINARY_URL Env Var: '${process.env.CLOUDINARY_URL || "Not Set"}'`);

cloudinary.api.ping()
  .then((res) => {
    console.log("✅ Success! Cloudinary connection established.");
    console.log(res);
  })
  .catch((err) => {
    console.error("❌ Failed to connect to Cloudinary:");
    console.error(err);
  });
