const Dish = require("../models/Dish");
const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");

exports.fetchDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate("category").exec();

    res.json(dishes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const dish = await Dish.findById(dishId).populate("category").exec();

    if (!dish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.json(dish);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createDish = async (req, res) => {
  try {
    const {
      image,
      name,
      code,
      description,
      category,
      daysServed,
      ingredients,
    } = req.body;

    const dish = new Dish({
      image,
      name,
      code,
      description,
      category,
      daysServed,
      ingredients,
    });

    await dish.save();

    res.json(dish);
  } catch (error) {
    console.log(error);
    res.json({
      message:
        error.code === 11000 ? "Dish already exists!" : "Internal server error",
      status: "false",
    });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const { code, name } = req.body;

    // Check if the dish code already exists
    const existingDishCode = await Dish.findOne({ code });

    if (existingDishCode) {
      return res
        .status(400)
        .json({ message: "Dish code already exists", status: "false" });
    }

    // Check if the dish name already exists
    const existingDishName = await Dish.findOne({ name });

    if (existingDishName) {
      return res
        .status(400)
        .json({ message: "Dish name already exists", status: "false" });
    }

    const updatedDish = await Dish.findByIdAndUpdate(dishId, req.body, {
      new: true,
    }).exec();

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.json(updatedDish);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const deletedDish = await Dish.findByIdAndDelete(dishId).exec();

    if (!deletedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    // Delete the associated image from Cloudinary
    if (deletedDish.image) {
      const publicId = deletedDish.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.json({ message: "Dish deleted successfully", status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadDishImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.uri, {
      public_id: uuid(),
      resource_type: "auto",
    });
    res.json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    console.log(error);
  }
};
