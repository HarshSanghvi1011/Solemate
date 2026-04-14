import { Router } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate(true), async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Only customers can place orders" });
  }
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  let total = 0;
  const lineItems = [];
  for (const line of cart.items) {
    const p = line.product;
    if (!p) continue;
    if (p.stock < line.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
    }
    const sub = p.price * line.quantity;
    total += sub;
    lineItems.push({
      product: p._id,
      name: p.name,
      brand: p.brand,
      imageUrl: p.imageUrl,
      price: p.price,
      quantity: line.quantity,
    });
  }
  if (!lineItems.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  const order = await Order.create({
    user: req.user._id,
    customerName: req.user.fullName || "Customer",
    customerEmail: req.user.email,
    items: lineItems,
    totalPrice: Math.round(total * 100) / 100,
    status: "Pending",
  });
  for (const line of cart.items) {
    const p = line.product;
    await Product.findByIdAndUpdate(p._id, { $inc: { stock: -line.quantity } });
  }
  cart.items = [];
  await cart.save();
  res.status(201).json(order);
});

router.get("/", authenticate(true), async (req, res) => {
  if (req.user.role === "admin") {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "email fullName");
    return res.json(orders);
  }
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/recent", authenticate(true), requireAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
  res.json(orders);
});

router.patch("/:id/status", authenticate(true), requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
