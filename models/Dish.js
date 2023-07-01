const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const dishSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 70,
      text: true,
    },
    // slug: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   index: true,
    // },
    code: { type: String, required: true },
    description: String,
    daysServed: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    ingredients: [String],
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
dishSchema.index({ "$**": "text" });

module.exports = model("Dish", dishSchema);
