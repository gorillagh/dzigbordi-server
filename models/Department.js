const { Schema, model } = require("mongoose");

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      text: true,
      unique: true,
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
departmentSchema.index({ "$**": "text" });

module.exports = model("Department", departmentSchema);
