const mongoose = require("mongoose");
console.log(process.env.MONGODB_URL);

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnection;
