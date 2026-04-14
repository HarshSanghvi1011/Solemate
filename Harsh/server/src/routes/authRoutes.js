import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { authenticate, signToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 characters"),
    body("confirmPassword").custom((v, { req }) => v === req.body.password),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hash,
      role: "customer",
    });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  }
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || user.role !== "customer") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  }
);

router.post(
  "/admin/login",
  [body("username").trim().notEmpty(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username, role: "admin" }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  }
);

router.get("/me", authenticate(true), (req, res) => {
  const u = req.user;
  res.json({
    user: {
      id: u._id,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      role: u.role,
    },
  });
});

export default router;
