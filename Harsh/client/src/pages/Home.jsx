import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { api } from "../api/client.js";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const HERO_BG =
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b8aa?w=1600&q=80";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products/trending").then((r) => setTrending(r.data)).catch(() => {});
  }, []);

  const handleAdd = async (id) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    try {
      await addItem(id, 1);
    } catch (e) {
      alert(e.response?.data?.message || "Could not add to cart");
    }
  };

  return (
    <main>
      <section
        className="relative min-h-[85vh] bg-black bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:max-w-[58%] lg:px-8">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-orange px-3 py-1">
            <Zap className="h-4 w-4 text-brand-orange" />
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              New Collection Drop
            </span>
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">Defy</span>
            <br />
            <span className="text-brand-orange">Gravity.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
            Experience next-level performance and street-ready style. Our newest silhouettes
            are engineered to push boundaries.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex w-fit items-center gap-2 bg-brand-orange px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:opacity-90"
          >
            Shop collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              <span className="text-white">Trending </span>
              <span className="text-brand-orange">Now</span>
            </h2>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm font-semibold text-white hover:text-brand-orange"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trending.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} showAdd onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 md:justify-between">
          {[
            "Free shipping over $100",
            "Easy 30-day returns",
            "Exclusive member deals",
          ].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-white/15 bg-brand-card px-6 py-3 text-center text-sm font-medium text-white"
            >
              {t}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
