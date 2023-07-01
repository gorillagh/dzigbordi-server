const { Schema, model } = require("mongoose");

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      text: true,
    },
    location: {
      type: String,
      // required: true,
    },
    // slug: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   index: true,
    // },
  },
  { timestamps: true }
);
branchSchema.index({ "$**": "text" });

module.exports = model("Branch", branchSchema);
