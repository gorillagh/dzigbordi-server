const Menu = require("../models/Menu");
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
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
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

    res.json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
