const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  Email: String,
  Password: String,
  Full_Name: String,
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
