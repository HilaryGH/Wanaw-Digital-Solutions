const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { host, port, name } = mongoose.connection;
    console.log(`✅ MongoDB connected to → ${host}:${port}/${name}`);
  } catch (error) {
    console.error("⛔️ MongoDB connection failed:", error.message);
    process.exit(1); // Force quit if DB connection fails
  }

  // Optional: remove debug logs in production
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true); // Log queries only in development
  }
};

module.exports = connectDB;


