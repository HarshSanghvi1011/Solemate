import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    featured,
    men,
    women,
  } = req.query;
  const q = {};
  if (search) {
    q.$or = [
      { name: new RegExp(search, "i") },
      { brand: new RegExp(search, "i") },
    ];
  }
  if (category && category !== "All") q.category = category;
  if (men === "true") q.category = "Men";
  if (women === "true") q.category = "Women";
  if (featured === "true") q.isFeatured = true;
  const min = minPrice != null ? Number(minPrice) : null;
  const max = maxPrice != null ? Number(maxPrice) : null;
  if (min != null && !Number.isNaN(min)) q.price = { ...q.price, $gte: min };
  if (max != null && !Number.isNaN(max)) q.price = { ...q.price, $lte: max };
  const products = await Product.find(q).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/trending", async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:id", param("id").isMongoId(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

const admin = [authenticate(true), requireAdmin];

router.post(
  "/",
  admin,
  [
    body("name").trim().notEmpty(),
    body("brand").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
    body("imageUrl").isURL(),
    body("category").isIn(["Men", "Women", "Kids", "Sport", "Casual"]),
    body("isFeatured").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  }
);

router.patch(
  "/:id",
  admin,
  param("id").isMongoId(),
  async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const allowed = [
      "name",
      "brand",
      "price",
      "originalPrice",
      "stock",
      "imageUrl",
      "category",
      "isFeatured",
      "rating",
      "reviewCount",
    ];
    const update = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }
);

router.delete("/:id", admin, param("id").isMongoId(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Deleted" });
});

export default router;
