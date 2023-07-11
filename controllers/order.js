const User = require("../models/User");
const Order = require("../models/Order");
const Department = require("../models/Department");
const Branch = require("../models/Branch");
const Category = require("../models/Category");
const Dish = require("../models/Dish");
const Menu = require("../models/Menu");

const axios = require("axios");

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const sendSMS = async (phoneNumber, reference) => {
  const customerData = {
    recipient: [`0${phoneNumber.slice(-9)}`],
    sender: "Dzigbordi",
    message:
      "Order successful! Please go to your dashboard to see order details. Thanks for choosing Dzigbordi.",

    is_schedule: "false",
    schedule_date: "",
  };

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  try {
    ///send to customer
    const customerResponse = await axios.post(
      `https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`,
      customerData,
      {
        headers,
      }
    );

    console.log(
      "Sent to user response====>",
      customerResponse.data,
      customerResponse.data
    );
  } catch (error) {
    console.log(error);
  }
};

exports.fetchSummary = async (req, res) => {
  try {
    //////get
    // 1. number of dishes
    const dishesTotal = 1;
    // 2. number of categories
    const categoriesTotal = 1;

    // 3. number of customers
    const customersTotal = 1;
    // 4. number of staff
    const staffTotal = 1;
    // 5. number of admins
    const adminsTotal = 1;
    // 6. numberof branches
    const branchesTotal = 1;
    // 7. number of departments
    const departmentsTotal = 1;
    res.json({
      ordersInfo: { upComing: 0, all: 0 },
      menuInfo: { dishesTotal, categoriesTotal },
      usersInfo: { customersTotal, staffTotal, adminsTotal },
      bankInfo: { branchesTotal, departmentsTotal },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "dishes.dish",
        model: "Dish",
      })
      .populate("orderedBy")
      .populate("processedBy.userId")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

exports.fetchOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate({
        path: "dishes.dish",
        model: "Dish",
      })
      .populate("orderedBy")
      .populate("processedBy.userId")
      .exec();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { dishes, notes } = req.body.data;
    const { _id, phoneNumber } = await User.findOne({
      phoneNumber: req.user.phone_number,
    }).exec();
    const reference = uuid();
    const newOrder = await new Order({
      reference,
      orderedBy: _id,
      dishes,
      notes,
    }).save();
    pusher.trigger("newOrder", "order-placed", newOrder);
    await sendSMS(phoneNumber, reference);

    res.json("Order placed");
    return;
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    ).exec();
    if (updatedOrder.orderStatus === "completed") {
      await sendSMS(updatedOrder.phoneNumber, updatedOrder.reference);
    }
    pusher.trigger("orderUpdate", "order-updated", updatedOrder);

    res.json("ok");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchUserOrders = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNumber: req.user.phone_number,
    }).exec();
    const orders = await Order.find({ orderedBy: user })
      .sort([["createdAt", "desc"]])
      .exec();

    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

exports.fetchUserOrder = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNumber: req.user.phone_number,
    }).exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, orderedBy: user._id })
      .sort([["createdAt", "desc"]])
      .exec();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
