import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solemate";

const products = [
  {
    name: "Air Zoom Pro",
    brand: "Nike",
    price: 129.99,
    originalPrice: 159.99,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    category: "Men",
    isFeatured: true,
    rating: 4,
    reviewCount: 342,
  },
  {
    name: "UltraBoost 22",
    brand: "Adidas",
    price: 179.99,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    category: "Men",
    isFeatured: true,
    rating: 4,
    reviewCount: 521,
  },
  {
    name: "React Infinity",
    brand: "Nike",
    price: 159.99,
    stock: 28,
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800",
    category: "Women",
    isFeatured: true,
    rating: 4,
    reviewCount: 189,
  },
  {
    name: "Cloud X 3",
    brand: "On Running",
    price: 149.99,
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    category: "Women",
    isFeatured: false,
    rating: 4,
    reviewCount: 112,
  },
  {
    name: "Fresh Foam 1080v12",
    brand: "New Balance",
    price: 164.99,
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
    category: "Men",
    isFeatured: false,
    rating: 4,
    reviewCount: 98,
  },
  {
    name: "Gel-Kayano 29",
    brand: "ASICS",
    price: 139.99,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1561909848-b4fc87720a63?w=800",
    category: "Women",
    isFeatured: false,
    rating: 4,
    reviewCount: 76,
  },
  {
    name: "Superstar OG",
    brand: "Adidas",
    price: 89.99,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800",
    category: "Kids",
    isFeatured: false,
    rating: 4,
    reviewCount: 210,
  },
  {
    name: "Air Force 1",
    brand: "Nike",
    price: 109.99,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1600185365928-3a27e7df57a0?w=800",
    category: "Kids",
    isFeatured: true,
    rating: 4,
    reviewCount: 203,
  },
  {
    name: "Glycerin 20",
    brand: "Brooks",
    price: 159.99,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    category: "Sport",
    isFeatured: false,
    rating: 4,
    reviewCount: 54,
  },
  {
    name: "Metcon 8",
    brand: "Nike",
    price: 129.99,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1579338559191-e7b8975365ad?w=800",
    category: "Sport",
    isFeatured: true,
    rating: 4,
    reviewCount: 88,
  },
  {
    name: "Classic Leather",
    brand: "Reebok",
    price: 79.99,
    stock: 42,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    category: "Casual",
    isFeatured: false,
    rating: 4,
    reviewCount: 145,
  },
  {
    name: "Chuck 70",
    brand: "Converse",
    price: 84.99,
    stock: 33,
    imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800",
    category: "Casual",
    isFeatured: false,
    rating: 4,
    reviewCount: 267,
  },
];

async function run() {
  await mongoose.connect(uri);
  await Product.deleteMany({});
  await User.deleteMany({ role: "admin" });

  const hash = await bcrypt.hash("admin123", 10);
  await User.create({
    username: "admin",
    password: hash,
    role: "admin",
    fullName: "Admin",
  });

  await Product.insertMany(products);
  console.log("Seeded admin (admin / admin123) and", products.length, "products.");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
