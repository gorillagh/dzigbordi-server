const Menu = require("../models/Menu");
const Dish = require("../models/Dish");
const Order = require("../models/Order");

exports.fetchMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate("dishes").exec();

    res.json({ menus });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchCurrentDayMenu = async (req, res) => {
  try {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    let adjustedDay = currentHour < 9 ? currentDay : currentDay + 1;
    if (adjustedDay > 6) adjustedDay = 0;
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() + adjustedDay - 2);
    adjustedDate.setHours(9, 0, 0, 0);

    // Format the adjusted date
    const formattedDate = `${adjustedDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(adjustedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${adjustedDate.getFullYear()}`;

    // Map the adjusted day to the corresponding day of the week
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDayOfWeek = daysOfWeek[adjustedDay];

    // Fetch the dishes for the current day
    const dishes = await Dish.find({ daysServed: currentDayOfWeek });

    // Check if there is an order with the adjusted date
    const existingOrder = await Order.findOne({ date: formattedDate });

    if (!existingOrder) {
      // Create a new order with the adjusted date
      const newOrder = new Order({
        date: formattedDate,
        orderList: [],
      });
      await newOrder.save();

      res.json({
        day: currentDayOfWeek,
        date: formattedDate,
        dishes,
        orders: newOrder.orderList,
      });
    } else {
      res.json({
        day: currentDayOfWeek,
        date: formattedDate,
        dishes,
        orders: existingOrder.orderList,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId).populate("dishes").exec();

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { day, duration, dishes } = req.body;

    // Create a new menu object
    const menu = new Menu({
      day,
      duration,
      dishes,
    });

    // Save the menu to the database
    await menu.save();

    res.status(201).json({ menu });
  } catch (error) {
    console.log(error);
    res.json({
      message:
        error.code === 11000 ? "Dish already exists!" : "Internal server error",
      status: "false",
    });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const { name } = req.body;

    // Check if the menu name already exists
    const existingMenu = await Menu.findOne({ name });

    if (existingMenu) {
      return res
        .status(400)
        .json({ message: "Menu name already exists", status: "false" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(menuId, req.body, {
      new: true,
    }).exec();

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const deletedMenu = await Menu.findByIdAndDelete(menuId).exec();

    if (!deletedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Menu deleted successfully", status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
