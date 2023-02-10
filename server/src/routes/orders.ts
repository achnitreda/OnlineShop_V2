import express from "express";
const router = express.Router();
import { Order } from "../models/order";

router.get("/", async (req, res) => {
  const orders = await Order.find();
  if (!orders) {
    res.status(500).json({ success: false });
  }
  res.json({ data: orders });
});


export default router;