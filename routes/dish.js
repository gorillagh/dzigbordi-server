const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchDishes,
  fetchDish,
  createDish,
  uploadDishImage,
  updateDish,
  deleteDish,
} = require("../controllers/dish");

router.post("/dishes", authCheck, fetchDishes);
router.post("/dishes/:id", authCheck, fetchDish);
router.post("/dishes-create", authCheck, adminCheck, createDish);
router.post("/dishes-uploadImage", authCheck, adminCheck, uploadDishImage);
router.post("/dishes-update/:id", authCheck, adminCheck, updateDish);
router.post("/dishes-delete/:id", authCheck, adminCheck, deleteDish);

module.exports = router;
