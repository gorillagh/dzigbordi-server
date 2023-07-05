const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const menuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    dishes: [
      {
        type: ObjectId,
        ref: "Dish",
      },
    ],
    // Add any additional properties specific to a menu
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
