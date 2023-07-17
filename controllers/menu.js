const Menu = require("../models/Menu");
const Dish = require("../models/Dish");
const cloudinary = require("cloudinary").v2;

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
    const adjustedDay = currentHour < 9 ? currentDay - 1 : currentDay;
    const adjustedDate = new Date();
    adjustedDate.setDate(adjustedDate.getDate() - adjustedDay);

    // Format the adjusted date
    const formattedDate = `${adjustedDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(adjustedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${adjustedDate.getFullYear()}`;

    console.log("date===>", formattedDate);
    // Map the adjusted day to the corresponding day of the week
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const currentDayOfWeek = daysOfWeek[adjustedDay];
    console.log("current day===>", currentDayOfWeek);
    // Fetch the dishes for the current day
    const dishes = await Dish.find({ daysServed: currentDayOfWeek });
    res.json({ day: currentDayOfWeek, date: formattedDate, dishes });
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
