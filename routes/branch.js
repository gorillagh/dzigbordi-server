const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchBranches,
  fetchBranch,
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../controllers/branch");

router.post("/branches", authCheck, fetchBranches);
router.post("/branches/:id", authCheck, fetchBranch);
router.post("/branches-create", authCheck, staffCheck, createBranch);
router.post("/branches-update/:id", authCheck, staffCheck, updateBranch);
router.post("/branches-delete/:id", authCheck, staffCheck, deleteBranch);

module.exports = router;
