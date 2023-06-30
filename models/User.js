const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    email: {
      type: String,
      // required: true,
      index: true,
    },
    favorites: [
      {
        type: ObjectId,
        ref: "Dish",
      },
    ],
    image: String,
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
