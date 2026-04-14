import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["Men", "Women", "Kids", "Sport", "Casual"],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual("status").get(function () {
  return this.isFeatured ? "Featured" : "Standard";
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
