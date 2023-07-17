const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    orderList: [
      {
        orderedBy: {
          type: ObjectId,
          ref: "User",
          // required: true,
        },
        dishes: [
          {
            dish: {
              type: ObjectId,
              ref: "Dish",
              // required: true,
            },
            quantity: {
              type: Number,
              // required: true,
            },
            customizations: String,
          },
        ],
        notes: String,
      },
    ],

    // orderStatus: {
    //   type: String,
    //   default: "processing",
    //   enum: ["processing", "dispatched", "cancelled", "completed"],
    // },
    // processedBy: [
    //   {
    //     userId: {
    //       type: ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     processedAt: {
    //       type: Date,
    //       default: Date.now(),
    //       required: true,
    //     },
    //     action: {
    //       type: String,
    //       enum: ["processing", "dispatched", "completed", "canceled"],
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
