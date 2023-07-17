const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  fetchOrders,
  fetchOrder,
  createOrUpdateOrder,
  updateOrder,
  deleteOrder,
  fetchUserOrders,
  fetchUserOrder,
  fetchSummary,
} = require("../controllers/order");

router.post("/summary", authCheck, staffCheck, fetchSummary);

router.post("/orders", authCheck, staffCheck, fetchOrders);
router.post("/orders/:id", authCheck, staffCheck, fetchOrder);
router.post("/orders-create-or-update", authCheck, createOrUpdateOrder);
router.post("/orders-update/:id", authCheck, staffCheck, updateOrder);
router.post("/orders-delete/:id", authCheck, staffCheck, deleteOrder);

router.post("/orders-user/:userId", authCheck, staffCheck, fetchUserOrders);
router.post("/orders-user/:userId/:id", authCheck, staffCheck, fetchUserOrder);

module.exports = router;
