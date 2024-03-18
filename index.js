const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const User = require("./user");
const bcrypt = require("bcrypt");
const generateToken = require("./token");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.exists({ email });
    if (userExist) {
      return res.status(500).json({ msg: "Already User" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      password: hashedPassword,
    });
    await user.save();
    const token = generateToken(user);
    return res.status(200).json({ msg: "Registered", token: token });
  } catch (e) {
    console.log(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ msg: "Not A User " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Wrong Password" });
    }
    const token = generateToken(user);
    return res.status(200).json({ msg: "Login", token: token });
  } catch (e) {
    console.log(e);
  }
});
app.post("/logout", async (req, res) => {
    try {
      const userId = req.userId;
  
      await invalidateToken(userId);
  
      return res.status(200).json({ msg: "Logged out successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connecter to db"))
  .catch((e) => {
    console.log(e);
  });
app.listen(5000, () => {
  console.log("running at 5000");
});
