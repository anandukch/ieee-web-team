const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const CachedUser = require("../models/cached_user");
const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.verify(token, "test");
  const user = await User.findOne({
    where: {
      id: decodedData.id,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
  req.user = user;
  next();
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    const token = jwt.sign({ id: user.id }, "test");
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "Auth successful",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/logout", auth, (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
});

router.post("/invitation", async (req, res) => {
  try {
    const token = uuid.v4();
    await CachedUser.create({
      unique_id: token,
      ...req.body,
    });

    return res.status(200).json({
      message: "Auth successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/create", async (req, res) => {
  try {
    const unq_id = req.id;
    const userDetails = await CachedUser.findOne({
      where: {
        id: unq_id,
      },
    });
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(userDetails,req.user);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email: userDetails.email,
      phone_number: userDetails.phone_number,
      alt_email: userDetails.alt_email,
      // organization: userDetails.organization,
    });
    await CachedUser.destroy({
      where: {
        id: unq_id,
      },
    });
    res.status(200).json({
      message: "User created",
    });
    const token = jwt.sign({ id: user.id }, "test");
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "User created",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    const { email, phone_number, alt_email, organization } = req.body;
    const user = await User.update(
      {
        email,
        phone_number,
        alt_email,
        organization,
      },
      {
        where: {
          id: req.user.user_id,
        },
      }
    );
    res.status(200).json({
      message: "User details updated",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.findAll({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
