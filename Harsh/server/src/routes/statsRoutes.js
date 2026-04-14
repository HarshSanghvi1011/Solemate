import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(authenticate(true), requireAdmin);

router.get("/stats", async (req, res) => {
  const [orders, products, revenueAgg] = await Promise.all([
    Order.find(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { status: { $nin: ["Cancelled"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  res.json({
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    pendingOrders,
    totalProducts: products,
  });
});

router.get("/revenue-chart", async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = days.map((label, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return { label, start: d, end: next };
  });
  const orders = await Order.find({
    status: { $nin: ["Cancelled"] },
    createdAt: { $gte: buckets[0].start, $lt: buckets[6].end },
  });
  const data = buckets.map(({ label, start: s, end: e }) => {
    const sum = orders
      .filter((o) => o.createdAt >= s && o.createdAt < e)
      .reduce((acc, o) => acc + o.totalPrice, 0);
    return { day: label, revenue: Math.round(sum * 100) / 100 };
  });
  res.json(data);
});

export default router;
