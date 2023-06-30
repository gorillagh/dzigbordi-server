const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

router.post("/categories", authCheck, fetchCategories);
router.post("/categories/:id", authCheck, fetchCategory);
router.post("/categories-create", authCheck, staffCheck, createCategory);
router.post("/categories-update/:id", authCheck, staffCheck, updateCategory);
router.post("/categories-delete/:id", authCheck, staffCheck, deleteCategory);

module.exports = router;
