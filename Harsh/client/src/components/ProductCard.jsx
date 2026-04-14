import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export function ProductCard({ product, onAdd, showAdd }) {
  const { name, brand, price, originalPrice, imageUrl, isFeatured, rating, reviewCount } =
    product;

  return (
    <div className="overflow-hidden rounded-xl bg-brand-card border border-white/5">
      <div className="relative aspect-[4/3] bg-zinc-900">
        {isFeatured && (
          <span className="absolute left-2 top-2 bg-brand-orange px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Featured
          </span>
        )}
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase text-brand-orange">{brand}</p>
        <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-white">
          {name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= (rating || 4) ? "fill-current" : "text-zinc-600"}`}
            />
          ))}
          <span className="ml-1 text-xs text-zinc-500">({reviewCount ?? 0})</span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-white">${Number(price).toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-zinc-500 line-through">
              ${Number(originalPrice).toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            to="/shop"
            className="flex-1 rounded-lg border border-white/20 py-2 text-center text-xs font-bold uppercase text-white hover:border-brand-orange hover:text-brand-orange"
          >
            View
          </Link>
          {showAdd && (
            <button
              type="button"
              onClick={() => onAdd?.(product._id)}
              className="flex-1 rounded-lg bg-brand-orange py-2 text-xs font-bold uppercase text-white hover:opacity-90"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
