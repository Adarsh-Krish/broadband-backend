const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb+srv://broadband_user:Tm84ITbv1e4QB2kz@broadband-cluster.wgq3i0z.mongodb.net/broadband?appName=broadband-cluster";
    console.log("Connecting with URI:", uri ? "URI EXISTS" : "URI MISSING");
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
