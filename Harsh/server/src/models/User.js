import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
