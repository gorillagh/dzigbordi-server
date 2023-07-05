const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchMenus,
  fetchMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

router.post("/menus", authCheck, fetchMenus);
router.post("/menus/:id", authCheck, fetchMenu);
router.post("/menus-create", authCheck, adminCheck, createMenu);
router.post("/menus-update/:id", authCheck, adminCheck, updateMenu);
router.post("/menus-delete/:id", authCheck, adminCheck, deleteMenu);

module.exports = router;
