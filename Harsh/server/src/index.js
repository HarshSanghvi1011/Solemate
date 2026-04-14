import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
      if (origin === CLIENT_ORIGIN || isLocalhost) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", statsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solemate";
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Using insecure default for development only.");
  process.env.JWT_SECRET = "dev-only-change-me";
}

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });
