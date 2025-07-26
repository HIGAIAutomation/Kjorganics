const { v2:cloudinary } =require("cloudinary");

// Configure Cloudinary using CLOUDINARY_URL from .env
const Cloudinaryfn = (async function () {
  await cloudinary.config(process.env.CLOUDINARY_URL); // Automatically uses process.env.CLOUDINARY_URL
  console.log("Yes You Have connected cloudinary");
})();


module.exports = Cloudinaryfn; 
