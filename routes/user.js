const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  uploadImage,
} = require("../controllers/user");

router.post("/users", authCheck, staffCheck, fetchUsers);
router.post("/users/:id", authCheck, staffCheck, fetchUser);
router.post("/users-create", authCheck, staffCheck, createUser);
router.post("/users-update/:id", authCheck, staffCheck, updateUser);
router.post("/users-delete/:id", authCheck, staffCheck, deleteUser);

router.post("/users/upload-image", authCheck, uploadImage);

module.exports = router;
