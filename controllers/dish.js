const Dish = require("../models/Dish");
const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;

exports.fetchDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate("category").exec();

    const categories = await Category.find().exec();

    res.json({ dishes, categories });
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
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const dishId = req.params.id;
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

    res.json({ message: "Dish deleted successfully" });
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
