const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

const redisConnector = async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("🚨 Redis connection failed:", error);
  }
};

module.exports = {redisConnector,client};