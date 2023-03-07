const mongoose = require("mongoose");

const CompanySchema = mongoose.Schema({
  Company_Name: String,
  Position: String,
  Contract: String,
  Location: String,
});

const CompanyModel = mongoose.model("company", CompanySchema);

module.exports = { CompanyModel };
