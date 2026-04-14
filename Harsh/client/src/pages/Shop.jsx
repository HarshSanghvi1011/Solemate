import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../api/client.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Men", "Women", "Kids", "Sport", "Casual"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get("category") || "All";
  const q = searchParams.get("q") || "";
  const minP = Number(searchParams.get("min") || 50);
  const maxP = Number(searchParams.get("max") || 300);
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (q) params.set("search", q);
    params.set("minPrice", String(minP));
    params.set("maxPrice", String(maxP));
    api
      .get(`/products?${params.toString()}`)
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, q, minP, maxP]);

  const filteredCount = products.length;

  const setCat = (c) => {
    const next = new URLSearchParams(searchParams);
    if (c === "All") next.delete("category");
    else next.set("category", c);
    setSearchParams(next);
  };

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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          <span className="text-white">The </span>
          <span className="text-brand-orange">Collection</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Discover our full range of premium footwear designed for peak performance and
          unparalleled style.
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 space-y-8 lg:w-64">
          <div>
            <label className="mb-2 flex items-center gap-2 rounded-lg border border-white/10 bg-brand-input px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                type="search"
                placeholder="Search..."
                value={q}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  if (e.target.value) next.set("q", e.target.value);
                  else next.delete("q");
                  setSearchParams(next);
                }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
            </label>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Categories
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => {
                const active = category === c || (c === "All" && !searchParams.get("category"));
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => setCat(c)}
                      className={`w-full rounded-r-lg border-l-2 py-2 pl-3 text-left text-sm font-semibold uppercase transition ${
                        active
                          ? "border-brand-orange bg-white/5 text-brand-orange"
                          : "border-transparent text-zinc-400 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Price range
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={400}
                value={minP}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  next.set("min", e.target.value);
                  setSearchParams(next);
                }}
                className="w-full accent-brand-orange"
              />
              <input
                type="range"
                min={0}
                max={400}
                value={maxP}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  next.set("max", e.target.value);
                  setSearchParams(next);
                }}
                className="w-full accent-brand-orange"
              />
              <p className="text-xs text-zinc-400">
                ${minP} — ${maxP >= 400 ? "250+" : maxP}
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-6 text-sm text-zinc-500">
            Showing {loading ? "…" : filteredCount} results
          </p>
          {loading ? (
            <p className="text-zinc-500">Loading products…</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} showAdd onAdd={handleAdd} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
