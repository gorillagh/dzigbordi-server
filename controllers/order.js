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
    // 1. Number of dishes
    const dishesTotal = await Dish.countDocuments();

    // 2. Number of categories
    const categoriesTotal = await Category.countDocuments();

    // 3. Number of customers
    const customersTotal = await User.countDocuments({ role: "subscriber" });

    // 4. Number of staff
    const staffTotal = await User.countDocuments({ role: "staff" });

    // 5. Number of admins
    const adminsTotal = await User.countDocuments({ role: "admin" });

    // 6. Number of branches
    const branchesTotal = await Branch.countDocuments();

    // 7. Number of departments
    const departmentsTotal = await Department.countDocuments();

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

exports.createOrUpdateOrder = async (req, res) => {
  try {
    console.log("Order---->", req.body);

    const existingOrder = await Order.findOne({ date: req.body.date });

    if (existingOrder) {
      const { orderList } = existingOrder;
      const userId = req.body.orderedBy;
      const orderItem = orderList.find((item) => item.orderedBy.equals(userId));

      if (orderItem) {
        // Update existing order item
        const { _id, quantity } = req.body.dish;
        orderItem.dishes.push({ _id, quantity });
      } else {
        // Create new order item
        const { _id, quantity } = req.body.dish;
        const newOrderItem = {
          orderedBy: userId,
          dishes: [{ _id, quantity }],
        };
        orderList.push(newOrderItem);
      }

      await existingOrder.save();

      res.json({ order: existingOrder });
    } else {
      // Create new order
      const { date, orderedBy, dish } = req.body;

      const newOrder = new Order({
        date,
        orderList: [
          {
            orderedBy: orderedBy,
            dishes: [{ dish: dish._id, quantity: dish.quantity }],
          },
        ],
      });

      await newOrder.save();

      res.json({ order: newOrder });
    }

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
