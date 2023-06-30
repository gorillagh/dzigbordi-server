const User = require("../models/User");

exports.checkPhoneNumber = async (req, res) => {
  try {
    const found = await User.findOne({
      phoneNumber: req.params.phoneNumber,
    });
    if (found) {
      res.json("true");
    } else {
      res.json("false");
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.createOrUpdateUser = async (req, res) => {
  const user = await User.findOne({
    phoneNumber: req.user.phone_number,
  }).exec();

  if (!user) {
    const newUser = await new User({
      phoneNumber: req.user.phone_number,
      name: "Customer",
    }).save();
    res.json(newUser);
  } else {
    res.json(user);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone_number } = req.user;
    const user = await User.findOne({ phoneNumber: phone_number }).exec();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNumber: req.user.phone_number,
    }).exec();
    if (user) {
      res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.currentAdmin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

exports.currentStaff = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const _id = req.params.slug;
  try {
    const updatedUser = await User.findOneAndUpdate({ _id }, req.body, {
      new: true,
    }).exec();
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
