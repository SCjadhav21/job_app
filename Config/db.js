const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.Mongourl);
module.exports = { connection };
