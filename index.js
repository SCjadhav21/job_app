require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const { UserModel } = require("./Model/user.model");
const { connection } = require("./Config/db");
const { CompanyModel } = require("./Model/company.model");
app.use(express.json());
app.use(cors());
app.post("/register", async (req, res) => {
  const { Email, Password, Full_Name } = req.body;
  try {
    const user = await UserModel.find({ Email });

    if (user.length > 0) {
      res.send("email is already exist");
    } else {
      bcrypt.hash(Password, 6, async (err, hash) => {
        const user = new UserModel({ Email, Full_Name, Password: hash });
        await user.save();
        res.send("Registered successfully");
      });
    }
  } catch (err) {
    res.send("Error while registering");
  }
});

app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await UserModel.findOne({ Email });

    if (user) {
      bcrypt.compare(Password, user.Password, function (err, result) {
        if (err) {
          res.send("something went wrong");
        } else if (result) {
          const token = jwt.sign({ userId: user._id }, process.env.key);
          res.send({ res: "Login Successfull", email: Email, token: token });
        } else {
          res.send("Invalid Credentials");
        }
      });
    } else {
      res.send("wrong Credentials");
    }
  } catch (err) {
    res.send("Something went wrong");
  }
});

app.post("/job", async (req, res) => {
  const { Company_Name, Position, Contract, Location } = req.body;
  try {
    const company = new CompanyModel({
      Company_Name,
      Position,
      Contract,
      Location,
    });
    await company.save();
    res.send("company added successfully");
  } catch (err) {
    res.send("something went wrong");
  }
});

app.get("/job", async (req, res) => {
  try {
    let companies = await CompanyModel.find();
    res.send(companies);
  } catch (err) {
    res.send("something went wrong");
  }
});

app.get("/jobData", async (req, res) => {
  let contractBy = req.query.contract;
  try {
    let companies = await CompanyModel.find({ Contract: contractBy });
    res.send(companies);
  } catch (err) {
    res.send("something went wrong");
  }
});

app.get("/jobDatabyLocation", async (req, res) => {
  let location = req.query.location;
  try {
    let companies = await CompanyModel.find({ Location: location });
    res.send(companies);
  } catch (err) {
    res.send("something went wrong");
  }
});

app.get("/jobsearch/:search", async (req, res) => {
  let search = req.params.search;
  try {
    let data = await CompanyModel.find({
      Company_Name: { $regex: search, $options: "i" },
    });
    res.send(data);
  } catch (err) {
    res.send("something went wrong");
  }
});
app.delete("/job/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let data = await CompanyModel.findOneAndDelete({ _id: id });
    res.send("data deleted");
  } catch (err) {
    res.send("something went wrong");
  }
});
app.patch("/job/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let data = await CompanyModel.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res.send("data deleted");
  } catch (err) {
    res.send("something went wrong");
  }
});

app.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log(`Connect to db and running on ${process.env.port}`);
  } catch (err) {
    console.log(err);
  }
});
