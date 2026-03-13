const mongoose = require("mongoose");

async function connectToDataBase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // app band ho jayega agar DB fail ho
  }
}

module.exports = connectToDataBase;
