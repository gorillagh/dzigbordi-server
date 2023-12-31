const User = require("../models/User");
const Branch = require("../models/Branch");
const Department = require("../models/Department");

const cloudinary = require("cloudinary").v2;

exports.fetchUsers = async (req, res) => {
  try {
    const categorizedUsers = { subscriber: [], staff: [], admin: [] };

    const users = await User.find()
      .populate("favorites")
      .populate("branch")
      .populate("department")
      .sort([["createdAt", "asc"]])
      .exec();

    // Categorize users by role
    users.forEach((user) => {
      categorizedUsers[user.role].push(user);
    });

    res.json(categorizedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("favorites")
      .populate("branch")
      .populate("department")
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { branch, department, ...userData } = req.body;

    // Retrieve the branch and department documents from their respective collections
    const b = await Branch.findById(branch);
    const d = await Department.findById(department);

    if (!branch || !department) {
      return res.status(404).json({ error: "Branch or department not found" });
    }

    // Assign the retrieved branch and department to the user document
    const user = new User({
      ...userData,
      branch: b,
      department: d,
    });

    await user.save();

    res.json(user);
  } catch (error) {
    // console.log(error);
    console.log(error.code);
    res.json({
      message:
        error.code === 11000
          ? "Phone number already exists!"
          : "Internal server error",
      status: "false",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { branch, department, ...userData } = req.body;
    const { id } = req.params;

    // Retrieve the branch and department documents from their respective collections
    const b = await Branch.findById(branch);
    const d = await Department.findById(department);

    if (!b || !d) {
      return res.status(404).json({ error: "Branch or department not found" });
    }

    // Check if the phone number already exists for a different user
    const existingUser = await User.findOne({
      phoneNumber: userData.phoneNumber,
      _id: { $ne: id },
    });
    if (existingUser) {
      return res.json({
        message: "Phone number already exsists",
        status: "false",
      });
    }

    // Update the user document
    const user = await User.findByIdAndUpdate(
      id,
      {
        ...userData,
        branch: b,
        department: d,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      _id: req.params.id,
    }).exec();

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: `${deletedUser.name} deleted successfully`,
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNumber: req.user.phone_number,
    }).exec();
    const result = await cloudinary.uploader.upload(req.body.uri, {
      public_id: user._id,
      resource_type: "auto",
    });
    res.json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    console.log(error);
  }
};

exports.remove = (req, res) => {
  const image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("Delete successful");
  });
};
