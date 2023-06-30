const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department");

router.post("/departments", authCheck, staffCheck, fetchDepartments);
router.post("/departments/:id", authCheck, staffCheck, fetchDepartment);
router.post("/departments-create", authCheck, staffCheck, createDepartment);
router.post("/departments-update/:id", authCheck, staffCheck, updateDepartment);
router.post("/departments-delete/:id", authCheck, staffCheck, deleteDepartment);

module.exports = router;
