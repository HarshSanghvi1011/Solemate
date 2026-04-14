import { Router } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate(true));

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }
  return cart;
}

router.get("/", async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
});

router.post("/items", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product" });
  }
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }
  const cart = await Cart.findOne({ user: req.user._id });
  const items = cart?.items || [];
  const idx = items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) {
    const nextQty = items[idx].quantity + quantity;
    if (nextQty > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }
    items[idx].quantity = nextQty;
  } else {
    items.push({ product: productId, quantity });
  }
  const updated = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("items.product");
  res.json(updated);
});

router.patch("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!mongoose.isValidObjectId(productId) || quantity < 1) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (quantity > product.stock) {
    return res.status(400).json({ message: "Not enough stock" });
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart empty" });
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: "Item not in cart" });
  item.quantity = quantity;
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.product");
  res.json(populated);
});

router.delete("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product" });
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json(await getOrCreateCart(req.user._id));
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.product");
  res.json(populated);
});

router.delete("/", async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
});

export default router;
